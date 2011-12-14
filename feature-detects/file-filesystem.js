
// filesystem API

// dev.w3.org/2009/dap/file-system/file-dir-sys.html

// The API will be present in Chrome incognito, but will throw an exception.
//   code.google.com/p/chromium/issues/detail?id=93417


Modernizr.addTest('filesystem', function(){

  var prefixes = Modernizr._domPrefixes;
  
  for ( var i = -1, len = prefixes.length; ++i < len; ){
    if ( window[prefixes[i] + 'RequestFileSystem'] ) return true;
  }
  return 'requestFileSystem' in window;

});
