/**
 * Message Manager class that will handle all the messages send and received from the Lassie webview.
 */
var MessageManager = Class.create(Manager, {

  /**
   * Class ID
   */
  id: 'MessageManager',

  /**
   * Packet IDS
   */
  INITIALIZE_PACKET_ID : 1,
  RFID_PACKET_ID : 2,
  RAW_NFC_PACKET_ID : 3,
  SEND_PIN_TERMINAL_PACKET_ID : 4,
  RECEIVE_PIN_TERMINAL_PACKET_ID : 5,

  /**
   * Variables
   */
  host : null,
  webview : null,

  /**
   * Initialize
   */
  initialize: function ($super) {

    // get the host
    this.host = '*';

    // get the webview element
    this.webview = document.getElementById('webview');

    setTimeout(function() {
      $(this.webview).attr('src', 'http://localhost/boris-dev/app/');
    }, 8000);
    // initialize the parent class
    $super(1000);
  },

  /**
   * Execution of the thread
   */
  run : function() {

    // test
    //this.sendMessage(this.RFID_PACKET_ID, '0221422829');
  },

  /**
   * Send raw NFC data
   */
  sendRawNFCData : function(type, ndef) {

    // variables
    var data = {
      'type' : type,
      'ndef' : ndef
    };

    // send the message
    this.sendMessage(this.RAW_NFC_PACKET_ID, data);
  },

  /**
   * Send a message
   */
  sendMessage : function(packetId, data) {

    // variables
    var packet = {
      'id' : packetId,
      'data' : data
    };

    // debug
    debug('Sending message to '+ this.host +' with packet ID: '+ packetId + ', data:');
    debug(packet);

    // post the message
    this.webview.contentWindow.postMessage(packet, this.host);
  },

  /**
   * Handle an incoming message
   */
  handleMessage : function(event) {

    // variables
    var packet = event.data;
    var packetId = packet.id;
    var data = packet.data;

    // debug
    debug('Handling message from chrome app with packet ID: '+ packetId +', data:');
    debug(data);

    // switch on the packet id
    switch (packetId) {

      // load packet
      case this.INITIALIZE_PACKET_ID:

        // execute handler
        this.handleInitializePacket(data);
        break;
    }
  },

  /**
   * Handle the initialize packet
   */
  handleInitializePacket : function(data) {

    // variables
    var commandPanel = getEngine().getCommandPanelController();
    var systemName = data.system_name;
    var systemVersion = data.system_version;
    var distribution = data.distribution;
    var interfaceColor = data.interface_color;

    // set the parameters of the control panel
    commandPanel.safeApply(function() {
      commandPanel.systemName = systemName;
      commandPanel.systemVersion = systemVersion;
      commandPanel.distribution = distribution;
    });

    // integrate the interface colors in the UI
    $('#command-panel .toggle-button').mouseover(function() {
      $(this).css('background-color', interfaceColor);
    }).mouseout(function() {
      $(this).css('background-color', '');
    });
    $('h1').css('background-color', interfaceColor);

    // debug
    debug('The webview is successfully connected!');
  },

  /**
   * Handle the event when the webview is done loading
   */
  sendInitializePacket : function() {

    // send a load message
    this.sendMessage(this.INITIALIZE_PACKET_ID, {});
  },

  /**
   * Disconnect from the device
   */
  destruct : function() {
    // empty
  }

});
