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
  // empty

  /**
   * Initialize
   */
  initialize: function ($super) {

    // debug all available devices
    this.debugDevices();

    // initialize the parent class
    $super(500);
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
   * Perform read
   */
  read : function() {

    // perform find first
    chrome.nfc.findDevices(function(devices) {

      // guard: check if there were any devices
      if (devices.length <= 0) {
        return;
      }

      // loop all the devices
      for (var i = 0; i < devices.length; i++) {

        // get the first device
        var device = devices[i];

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
    });
  },

  /**
   * Disconnect from the device
   */
  destruct : function() {
    // empty
  }

});
