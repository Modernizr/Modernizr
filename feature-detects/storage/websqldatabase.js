define(['Modernizr'], function( Modernizr ) {
  // Chrome incognito mode used to throw an exception when using openDatabase
  // It doesn't anymore.

  Modernizr.addTest('websqldatabase', !!window.openDatabase);
});
