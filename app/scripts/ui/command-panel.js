/**
 * Chrome app
 */
var angularChromeApp = angular.module('chrome_app', []);

// disable history state
// SOURCE: https://github.com/angular/angular.js/issues/11932
angularChromeApp.config(function($provide) {
  $provide.decorator('$window', function($delegate) {
    Object.defineProperty($delegate, 'history', {get: () => null});
    return $delegate;
  });
});

/**
 * Command panel controller
 */
angularChromeApp.controller('command_panel_controller', ['$scope', function($scope) {

  /**
   * System parameters
   */
  $scope.systemName = '';
  $scope.systemVersion = '';
  $scope.distribution = {
    name : 'unknown',
    host : '',
  };

  /**
   * Storage the distributions
   */
  $scope.distributions = [];

  /**
   * Storage for all the NCF readers
   */
  $scope.nfcReaders = [];

  /**
   * Storage for all the card terminals
   */
  $scope.cardTerminals = [];

  /**
   * Initialize
   */
  $scope.initialize = function() {

    // debug
    debug('Initializing the command panel controller', $scope.getName());

    // DOM events
    $scope.initializeDOMEvents();

    // threads
    setInterval(function() {

      // update the NFC readers
      //$scope.updateNFCReaders();
    }, ONE_SECOND);

    // check for a development environment
    if (DEVELOPMENT) {

      // apply changes
      $scope.safeApply(function() {

        // set to distributions
        $scope.distributions = [
          { name : 'Local @ Pep', host : 'http://localhost/lassie-core-dev/app/' },
          { name : 'Local @ Paul', host : 'http://localhost/boris/app/' },
          { name : 'Local @ Joep', host : 'http://localhost/boris/app/' },
        ];

        // set to dummy nfc readers
        /*$scope.nfcReaders = [
          { productId : 'ACS Dummy', vendorId : 'ACS Dummy' }
        ];*/

        // set to dummy card terminals
        $scope.cardTerminals = [
          {name : 'Xenta Dummy'}
        ];
      });
    }

    // setting up listeners
    /*$scope.$watch('energyCheckRecord', function() {

      // update the interfaces
      $scope.update();
    }, true);*/
  };

  /**
   * Set DOM events with jQuery
   */
  $scope.initializeDOMEvents = function() {

    // wait for document ready
    $(document).ready(function() {

      /**
       * Show and hide the command panel
       */
      $('#command-panel .toggle-button').click(function() {

        var vendorId = 0x072f;
        var productId = 0x2200;

        function onDeviceFound(devices) {
          this.devices=devices;
          if (devices) {
            if (devices.length > 0) {
              console.log("Device(s) found: "+devices.length);
            } else {
              console.log("Device could not be found");
            }
          } else {
            console.log("Permission denied.");
          }
        }

        chrome.usb.getDevices({"vendorId": vendorId, "productId": productId}, onDeviceFound);

        // check if closed
        if ($('#command-panel').hasClass('open')) {

          // show
          $('#command-panel').removeClass('open');
          $('#webview').removeClass('small');
        } else {

          // hide
          $('#command-panel').addClass('open');
          $('#webview').addClass('small');
        }
      });
    });
  };

  /**
   * Update the UI
   */
  $scope.update = function() {

    // perform safe apply
    $scope.safeApply(function() {

    });
  };

  /**-----------------------------------------------------------------------------------------------------------**/
  /**                                                DISTRIBUTIONS                                              **/
  /**-----------------------------------------------------------------------------------------------------------**/

  /**
   * Change the location of the distribution
   */
  $scope.setDistributionHost = function(host) {

    // show the overall overlay
    $('.loader-overlay.overall').fadeIn();

    //
  };

  /**-----------------------------------------------------------------------------------------------------------**/
  /**                                                 NFC READERS                                               **/
  /**-----------------------------------------------------------------------------------------------------------**/

  /**
   * Update the list in the UI
   */
  $scope.updateNFCReaders = function() {

    // update the NFC readers
    getEngine().getNFCReaderManager().updateNFCReaders();
  };

  /**
   * Update the NFC readers
   */
  $scope.setNFCReaders = function(nfcReaders) {

    // perform safe apply
    $scope.safeApply(function() {

      // change the reader list
      $scope.nfcReaders = nfcReaders;
    });
  };

  /**-----------------------------------------------------------------------------------------------------------**/
  /**                                                   HELPERS                                                 **/
  /**-----------------------------------------------------------------------------------------------------------**/

  /**
   * A safe apply helper
   * SOURCE: http://stackoverflow.com/questions/22733422/angularjs-rootscopeinprog-inprogress-error
   */
  $scope.safeApply = function (fn) {
    var phase = $scope.$root.$$phase;
    if (phase == '$apply' || phase == '$digest') {
      if (fn && typeof fn === 'function') {
        fn();
      }
    } else {
      $scope.$apply(fn);
    }
  };

  /**
   * Get the name of this controller
   */
  $scope.getName = function () {
    return 'command-panel';
  };

  /**
   * An object key helper
   * SOURCE: http://stackoverflow.com/questions/22691183/check-object-size-in-angularjs-template-doing-it-wrong
   */
  $scope.keys = Object.keys;

  // call initialize
  $scope.initialize();
}]);
