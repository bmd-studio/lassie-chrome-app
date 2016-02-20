/**
 * Handles data that is store in between sessions.
 */
var Storage = Class.create({

  /**
   * Class ID
   */
  id: 'Storage',

  /**
   * Initialize
   */
  initialize: function () {

  },

  /**
   * Get the last known connected com port
   */
  getLastPortPath: function(callback) {

    // perform get
    this.getLocal(LAST_PORT_PATH_INDEX, callback);
  },

  /**
   * Set the last known connected com port
   */
  setLastPortPath: function(value) {

    // perform set
    this.setLocal(LAST_PORT_PATH_INDEX, value);
  },

  /**
   * Get a stored value
   */
  getLocal: function(index, callback) {

    // debug
    debug('Fetching stored data at index: '+ index);

    // load the stored data
    chrome.storage.local.get(index, callback);
  },

  /**
   * Set a stored value
   */
  setLocal: function(index, value) {

    // save it using the Chrome extension storage API.
    chrome.storage.local.set({index: value}, function() {

      // guard: check for an error
      if (chrome.runtime.lastError) {
        debug('An error occurred while setting stored data: ' + chrome.runtime.lastError.message);
        return;
      }

      // notify that we saved.
      debug('Saving stored data at index: '+ index +', with value: '+ value);
    });
  }
});
