/**
 * Interprets an ArrayBuffer as UTF-8 encoded string data
 */
var byteArrayToString = function(buf) {

  // variables
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);

  // perform decode
  return encodedString;
};

/**
 * Converts a string to UTF-8 encoding in a Uint8Array; returns the array buffer
 */
var stringToByteArray = function(str) {

  // variables
  /*var encodedString = unescape(encodeURIComponent(str));
  var bytes = new Uint8Array(encodedString.length);

  // loop all the characters
  for (var i = 0; i < encodedString.length; ++i) {

    // add each character to the byte array
    bytes[i] = encodedString.charCodeAt(i);
  }*/

  // variables
  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
      bytes.push(str.charCodeAt(i));
  }

  return bytes;
};

/**
 * Convert a byte array to integer
 */
var byteArrayToInt = function(byteArray) {

  // variables
  var result = ((byteArray[byteArray.length - 1]) |
    (byteArray[byteArray.length - 2] << 8));

  // return the integer
  return result;
};

/**
 * Convert a byte array to long
 */
byteArrayToLong = function(/*byte[]*/byteArray) {

  // variables
  /*var result = ((byteArray[byteArray.length - 1]) |
    (byteArray[byteArray.length - 2] << 8) |
    (byteArray[byteArray.length - 3] << 16) |
    (byteArray[byteArray.length - 4] << 24));*/
  var result = (
    (byteArray[0] << 24) +
    (byteArray[1] << 16) +
    (byteArray[2] << 8) +
    (byteArray[3])
  );

  // return the integer
  return result;
};

/**
 * Generate an unique id
 * SOURCE: https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
 */
function generateUniqueId() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
}

/**
 * Expand date function to support 'now'
 * SOURCE: http://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
 */
if (!Date.now) {

    // return timestamp with millis
    Date.now = function() { return new Date().getTime(); }
};

/**
 * Get a specific value from an array
 */
getFromArray = function(key, array, defaultValue) {

  // check if the array is set
  if (!(array instanceof Array) && !(array instanceof Object)) {
    return defaultValue;
  }

  // check if the key is set
  if (key in array) {
    return array[key];
  }

  // no problem if the default value is not set
  // we will return undefined automatically
  return defaultValue;
};

/**
 * Set interval with a context
 * SOURCE: http://javascriptisawesome.blogspot.nl/2011/11/setinterval-with-context.html
 */
setIntervalWithContext = function(code,delay,context){
 return setInterval(function(){
  code.call(context)
 },delay);
};

/**
 * Set timeout with a context
 * SOURCE: http://javascriptisawesome.blogspot.nl/2011/11/setinterval-with-context.html
 */
setTimeoutWithContext = function(code,delay,context){
 return setTimeout(function(){
  code.call(context)
 },delay);
};
