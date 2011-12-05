
// determining low-bandwidth via navigator.connection
// this object only exists in Android 2.2+ and only in the Browser (not WebView)

// docs.phonegap.com/en/1.2.0/phonegap_connection_connection.md.html#connection.type
// davidbcalhoun.com/2010/using-navigator-connection-android

// unknown devices are assumed as fast
// for more rigorous network testing, consider boomerang.js: github.com/bluesmoon/boomerang/

Modernizr.addTest('lowbandwidth', function(){
    
  var connection = navigator.connection || {type:0, UNKNOWN: 0};  // polyfill

  return connection.type === connection.CELL_2G || connection.type === connection.CELL_3G;
  
});
