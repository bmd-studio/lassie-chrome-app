/**
 * Event that is called when the Chrome App is launched
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('../views/index.html', {
    id: "mainWindow",
    state: "fullscreen",
    innerBounds: {
        width: 1024,
        height: 768
    }
  }, function() {

    // log
    console.log('The application is going to be booted...');
  });
});

/**
 * Event that is called when the Chrome App is being shut down
 */
chrome.runtime.onSuspend.addListener(function() {

});

/**
 * Event that is called when the Chrome App is installed
 */
chrome.runtime.onInstalled.addListener(function() {

});
