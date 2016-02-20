/**-----------------------------------------------------------------------------------------------------------**/
/**                                                 VARIABLES                                                 **/
/**-----------------------------------------------------------------------------------------------------------**/

/**
 * System contants
 */
const DEVELOPMENT = true;
const DEBUG = true;
const SYSTEM_NAME = 'Lassie App';
const SYSTEM_VERSION = '0.01';
const SERIAL_BAUD_RATE = 115200;
const DISABLE_CACHE = true;
const ONE_SECOND = 1000;
const BASE_URL = '../'; // referenced from the view index.html
const PATH_TO_SCRIPTS = BASE_URL +'scripts/';
const PATH_TO_LIBRARIES = PATH_TO_SCRIPTS +'libraries/';
const PATH_TO_MANAGERS = PATH_TO_SCRIPTS +'managers/';
const PATH_TO_UTILITIES = PATH_TO_SCRIPTS +'utilities/';
const PATH_TO_UI= PATH_TO_SCRIPTS +'ui/';

/**
 * Storage constants
 */
const SIMPLE_SEPARATOR = '_';
const LAST_PORT_PATH_INDEX = 'lastPortPath';

/**
 * Packet constants
 */
const PACKET_START = '[START]';
const PACKET_END = '[END]';
const PACKET_SEPARATOR = '_';

// packet IDs
// NOTE: make sure these are in sync with the serial devices
const DATA_PACKET_ID = 1;

/**
 * Electronics constants
 */
const MAX_DATA_VALUE_VOLTAGE = 5.56;

/**
 * Loaded scripts
 */
var scriptPathArr = [
  PATH_TO_LIBRARIES +'class.min.js',
  PATH_TO_LIBRARIES +'underscore.min.js',
  PATH_TO_LIBRARIES +'jquery.min.js',
  PATH_TO_LIBRARIES +'angular.min.js',
  PATH_TO_LIBRARIES +'chrome-nfc.js',
  PATH_TO_UTILITIES +'Helpers.js',
  PATH_TO_UTILITIES +'Storage.js',
  PATH_TO_SCRIPTS +'Engine.js',
  PATH_TO_MANAGERS +'Manager.js',
  PATH_TO_MANAGERS +'SerialManager.js',
  PATH_TO_MANAGERS +'NFCReaderManager.js',
  PATH_TO_MANAGERS +'MessageManager.js',
  PATH_TO_UI +'command-panel.js',
];

/**
 * Engine instance
 */
var engine;

/**-----------------------------------------------------------------------------------------------------------**/
/**                                                    BOOT                                                   **/
/**-----------------------------------------------------------------------------------------------------------**/

/**
 * Booting of the application
 */
var bootApp = function() {

  // debug
  debug('Booting application (version '+ SYSTEM_VERSION +')...');

  // load all the required scripts
  requireScripts(function() {

    // initialize the engine when all the scripts are loaded
    initializeEngine();
  });
}

/**
 * Shutting down of the application
 */
var destructApp = function() {

}

/**
 * Initialize the Engine class
 */
var initializeEngine = function() {

  // debug
  debug('Starting the Engine...');

  // create a new engine instance
  engine = new Engine();

  // initialize the engine now the instance is known
  engine.initializeApp();

  // debug
  debug('The Engine is running!');
}

/**-----------------------------------------------------------------------------------------------------------**/
/**                                                  GETTERS                                                  **/
/**-----------------------------------------------------------------------------------------------------------**/

/**
 * Get the engine instance
 */
var getEngine = function() {
  return engine;
}

/**
 * Get the width of the screen
 */
var getScreenWidth = function() {
  return window.screen.availWidth;
}

/**
 * Get the height of the screen
 */
var getScreenHeight = function() {
  return window.screen.availHeight;
}

/**-----------------------------------------------------------------------------------------------------------**/
/**                                                DEPENDENCIES                                               **/
/**-----------------------------------------------------------------------------------------------------------**/

/**
 * Loading all the dependencies
 */
var requireScripts = function(onCompleteCallback) {

  // debug
  debug('Loading scripts...');

  // count the scripts
  var scriptCount = scriptPathArr.length;

  // loop all the scripts
  var loadSingleScript = function(index) {

    // variables
    var isLastScript = (index == scriptCount - 1);
    var scriptPath = scriptPathArr[index];
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptPath + (DISABLE_CACHE ? '?d='+ Date.now() : '');
    script.async = false;

    // set the callback of loading requireJS library
    var callback = function() {

      // guard: check if this was the final script
      if (isLastScript) {

        // debug
        debug('All the scripts are loaded!');

        // execute complete callback
        onCompleteCallback();
        return;
      }

      // load the next script
      loadSingleScript(index + 1);
    }

    // then bind the event to the callback function.
    // there are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // fire the loading
    head.appendChild(script);
  }

  // now start with the first file
  loadSingleScript(0);
}

/**-----------------------------------------------------------------------------------------------------------**/
/**                                                DEBUGGING                                                  **/
/**-----------------------------------------------------------------------------------------------------------**/

/**
 * Debug
 */
var debug = function(message, identifier, type) {

  // guard: check if the console exists
  if (typeof console != 'object' || !DEBUG) {
    return;
  }

  // check if we need to add a seperator for the identifier
  if (identifier !== undefined) {
    identifier = ' ('+ identifier +')';
  } else {
    identifier = '';
  }

  // check the type
  if (type == undefined) {
    type = 'DEBUG';
  }

  // log the message, prefix depends on the type
  if (typeof message === 'string') {
    console.log(SYSTEM_NAME + identifier +' ['+ type +']: ' + message);
  } else {
    console.log(message);
  }
}

/**
 * Show an error message
 */
var error = function(message, identifier) {
  debug(message, identifier, 'ERROR');
}

/**-----------------------------------------------------------------------------------------------------------**/
/**                                                   BOOT                                                    **/
/**-----------------------------------------------------------------------------------------------------------**/

// finally boot the app
bootApp();
