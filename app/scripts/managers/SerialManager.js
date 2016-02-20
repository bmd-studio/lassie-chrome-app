/**
 * Import the Chrome Serial instance
 */
const chromeSerial = chrome.serial;

/**
 * SerialManager class that handles all peripheral devices
 */
var SerialManager = Class.create(Manager, {

  /**
   * Class ID
   */
  id: 'SerialManager',

  /**
   * Variables
   */
  channelId : 0,
  portPath : '',
  lastConnectionPortPath : '',
  connectionId  : -1,
  connectionPortPath: '',
  connectionInfo: {},
  dataBuffer    : '',

  /**
   * Initialize
   */
  initialize: function ($super) {

    // initialize the channel
    this.channelId = generateUniqueId();

    // initialize the super class
    $super(1000);
  },

  /**
   * Execution of the thread
   */
  run : function() {

    // update the port list
    this.updatePortList();
  },

  /**
   * Update the available devices list
   */
  updatePortList : function() {

    // variables
    var thisObject = this;

    // populate the list of available devices
    this.getDevices(function(ports) {

      // get dropdown port selector
      var portList = $('.port-list');
      var currentValue = $(portList).val();

      // clear existing options
      $(portList).html('');

      // add new options
      ports.forEach(function (port) {

        // variables
        var displayName = port.path;
        var selectedClause = '';

        // check if the name is valid
        if (!displayName) {
          displayName = 'unknown';
        }

        // check for selected clause
        if (!currentValue) {
          currentValue = port.path;
        }

        // create a new option element
        var newOption = '<option value="'+ port.path +'">'+ displayName +'</option>';

        // add the new option element
        $(portList).append(newOption);
      });

      // set the port list value to the old one
      $(portList).val(currentValue);
    });
  },

  /**
   * On receive data
   */
  onReceive : function(receiveInfo) {

    // guard: check if the connection matches the received data connection
    if (receiveInfo.connectionId !== this.connectionId) {
      return;
    }

    // add to the buffer
    this.dataBuffer += byteArrayToString(receiveInfo.data);

    // debug
    //debug('New data buffer length: '+ this.dataBuffer.length);

    // variables
    var packetStartLength = PACKET_START.length;
    var packetEndLength = PACKET_END.length;
    var packetStartIndex = this.dataBuffer.indexOf(PACKET_START);
    var packetEndIndex = this.dataBuffer.indexOf(PACKET_END, packetStartIndex);

    // loop until there are no packets in the buffer anymore
    while (packetStartIndex >= 0 && packetEndIndex >= 0) {

      // get the first packet found in the buffer
      var rawPacket = this.dataBuffer.substring(packetStartIndex + packetStartLength, packetEndIndex);
      var rawPacketArr = stringToByteArray(rawPacket);

      // remove the packet from the buffer
      this.dataBuffer = this.dataBuffer.substring(packetEndIndex + packetEndLength + 1, this.dataBuffer.length);

      // potentially look for new packets
      packetStartIndex = this.dataBuffer.indexOf(PACKET_START);
      packetEndIndex = this.dataBuffer.indexOf(PACKET_END);

      // variables
      var channelId = parseInt(rawPacketArr.shift());
      var packetId = parseInt(rawPacketArr.shift());
      var rawDataArr = rawPacketArr;
      var dataArr = [];

      // loop all the data
      for (var index in rawDataArr) {

        // variables
        var rawData = rawDataArr[index];

        // convert each data piece to an integer
        dataArr.push(parseInt(rawData));
      }

      // debug
      /*debug('-------------');
      debug(rawPacketArr);
      debug(channelId);
      debug(packetId);
      debug(dataArr);*/

      // guard: check if the channel and packet ID are set
      if (isNaN(channelId) || isNaN(packetId) || channelId <= 0 || packetId <= 0) {
        continue;
      }

      // finally handle the packet
      this.handlePacket(channelId, packetId, dataArr);
    }
  },

  /**
   * Event when an error is received
   */
  onReceiveError : function(errorInfo) {

    // guard: check if the connection matches the current connection
    if (errorInfo.connectionId !== this.connectionId) {
      return;
    }

    // variables
    var thisObject = this;

    // show the error
    console.log(errorInfo);

    // reboot serial
    thisObject.destruct();

    // give some time to deconnect the serial
    setTimeout(function() {

      // reconnect
      thisObject.connect(thisObject.portPath);
    }, 200);
  },

  /**
   * Handler for received packets
   */
  handlePacket : function(channelId, packetId, rawDataArr) {

    // debug
    //debug('Handling a new packet (ID: '+ packetId + ') for channel (ID: '+ channelId +'):');
    //debug(rawDataArr);

    // check for a data packet
    if (packetId == DATA_PACKET_ID) {
    }
  },

  /**
   * Get all the available devices
   */
  getDevices : function(callback) {
    chromeSerial.getDevices(callback);
  },

  /**
   * Connect to a specific device
   */
  connect : function(portPath) {

    // variables
    var thisObject = this;
    var options = {
      'bitrate': SERIAL_BAUD_RATE,
    }

    // set local parameters
    this.portPath = portPath;

    // attempt to connect
    try {

      // connect
      chromeSerial.connect(portPath, options, function(connectionInfo) {

        // guard: check if the connection is valid
        if (!connectionInfo) {

          // debug error
          debug('Failed to establish a serial connection with '+ portPath);

          // attempt to connect again
          thisObject.connect(thisObject.portPath);
          return;
        }

        // debug
        debug('Successfully connected to '+ portPath);

        // initialize variables
        thisObject.connectionInfo = connectionInfo;
        thisObject.connectionPortPath = portPath;
        thisObject.connectionId = connectionInfo.connectionId;

        // add listeners
        chromeSerial.onReceive.addListener(thisObject.onReceive.bind(thisObject));
        chromeSerial.onReceiveError.addListener(thisObject.onReceiveError.bind(thisObject));

        // save the connection com port
        thisObject.saveConnection();

        // remove the connection drop-down
        $('.port-container').hide();
      });
    } catch (error) {
      // empty
    }
  },

  /**
   * Save this connection to the storage
   */
  saveConnection: function() {

    // save the current connected com port
    getEngine().getStorage().setLastPortPath(this.connectionPortPath);
  },

  /**
   * Send data to the device
   */
  send : function(message) {

    // guard: check if the connection is valid
    if (this.connectionId < 0) {
      debug('Cannot send data to the device as the connection is invalid.');
      return;
    }

    // sen the data
    chromeSerial.send(this.connectionId, formatStringToArrayBuffer(message), function() {
      // empty
    });
  },

  /**
   * Flush the data of the serial
   */
  flush : function() {

    // execute the flush
    chrome.serial.flush(this.connectionId, function() {
      // empty
    });
  },

  /**
   * Disconnect from the device
   */
  destruct : function() {

    // guard: check if the connection is valid
    if (this.connectionId < 0) {
      debug('Cannot disconnect the device as the connection is invalid.');
      return;
    }

    // disconnect
    chromeSerial.disconnect(this.connectionId, function(connectionInfo) {
      // empty
    });
  }

});
