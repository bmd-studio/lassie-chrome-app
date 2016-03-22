/**
 * The NFC Reader Manager handles all NFC readers
 */
var NFCReaderManager = Class.create(Manager, {

  /**
   * Class ID
   */
  id: 'NFCReaderManager',

  /**
   * Variables
   */
  devices : [],

  /**
   * Initialize
   */
  initialize: function ($super) {

    // debug all available devices
    this.updateDevices();

    // initialize the parent class
    $super(1000);
  },

  /**
   * Execution of the thread
   */
  run : function() {

    // handle potential NFC input
    this.read();
  },

  /**
   * Get all the available devices
   */
  getDevices : function(callback) {

    // perform find devices
    chrome.nfc.findDevices(callback);
  },

  /**
   * Loop through all the devices and debug them
   */
  debugDevices : function() {

    // debug
    debug('Listing all available NFC devices...');

    // perform find devices
    this.getDevices(function(devices) {

      // debug
      debug('Found '+ devices.length + ' NFC device(s)');

      // loop all the devices
      for (var i = 0; i < devices.length; i++) {

        // variables
        var device = devices[i];

        // debug
        debug('NFC device found with vendor: '+ device.vendorId +', product: '+ device.productId);
      }
    });
  },

  /**
   * Update the devices
   */
  updateDevices : function() {

    // variables
    var thisObject = this;

    // get all the devices
    this.getDevices(function(devices) {

      // variables
      var nfcReaders = [];

      // loop all the devices
      for (var i = 0; i < devices.length; i++) {

        // variables
        var device = devices[i];
        var vendorId = device.vendorId;
        var productId = device.productId;

        // get the name
        var name = getEngine().getNFCReaderManager().getName(vendorId, productId);

        // set the name
        device.name = name;

        // add the device
        nfcReaders.push(device);
      }

      // update the devices
      thisObject.devices = nfcReaders;

      // update the UI
      getEngine().getCommandPanelController().setNFCReaders(nfcReaders);
    });
  },

  /**
   * Perform read
   */
  read : function() {

    // loop all the devices
    for (var i = 0; i < this.devices.length; i++) {

      // get the first device
      var device = this.devices[i];

      // debug
      debug('Reading device...');

      /*var blockNumber = 0; // starting logic block number.
        var blocksCount = 1; // logic block counts.
        chrome.nfc.read_logic(device, blockNumber, blocksCount, function(rc, data) {
          log('Mifare Classic Tag', UTIL_BytesToHex(data));
        });*/

      // perform the read
      chrome.nfc.read(device, {}, function(type, ndef) {

        // variables
        var uri = ndef.ndef[0].uri;
        var text = ndef.ndef[1].text;

        // debug
        debug('New NFC data received with type: '+ type +', ndef: ');
        debug(ndef);

        // send it to the webview
        getEngine().getMessageManager().sendRawNFCData(type, ndef);
      });
    }
  },

  /**
   * Handle a new identifier of a tag
   */
  handleRFID : function(rfid) {

    // send it to the webview
    getEngine().getMessageManager().sendRFID(rfid);
  },

  /**
   * Get the name of a NFC reader
   */
  getName : function(vendorId, productId) {

    // ACR122U
    if (vendorId == 1839 && productId == 8704) {
      return 'ACR122U NCF Reader';
    }

    return 'Unknown Reader';
  },

  /**
   * Disconnect from the device
   */
  destruct : function() {
    // empty
  }

});
