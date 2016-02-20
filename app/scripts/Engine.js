/**
 * The Engine class handles all other instances managing the application
 */
var Engine = Class.create({

  /**
   * Class ID
   */
  id: 'Engine',

  /**
   * Manager instances
   */
  serialManager:      null,
  messageManager:     null,
  nfcReaderManager:   null,

  /**
   * Helper instances
   */
  storage: null,

  /**
   * DOM elements
   */
  webview: null,

  /**
   * Initialize
   */
  initialize: function () {

    // get the webview element
    this.webview = document.getElementById('webview');

    // message event
    window.addEventListener('message', function(event) {

      // execute handler in right context
      getEngine().getMessageManager().handleMessage(event);
    }, false);

    // load stop event
    this.webview.addEventListener('loadstop', function() {

      // execute handler in right context
      getEngine().getMessageManager().sendInitializePacket();

      // fade out the overlay
      $('.loader-overlay.overall').fadeOut();
    }, false);
  },

  /**
   * Initialize the manager instances
   */
  initializeApp: function () {

    // create new storage object
    this.storage = new Storage();

    // create new manager instances
    this.serialManager = new SerialManager();
    this.messageManager = new MessageManager();
    this.nfcReaderManager = new NFCReaderManager();
  },

  /**
   * Get the storage
   */
  getStorage : function() {
    return this.storage;
  },

  /**
   * Get the serial manager
   */
  getSerialManager : function() {
    return this.serialManager;
  },

  /**
   * Get the message manager
   */
  getMessageManager : function() {
    return this.messageManager;
  },

  /**
   * Get the NFC reader manager
   */
  getNFCReaderManager : function() {
    return this.nfcReaderManager;
  },

  /**
   * Get the command panel controller instance
   */
  getCommandPanelController : function() {
    return angular.element($('#command-panel')).scope();
  }

});
