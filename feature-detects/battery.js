define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // Battery API
  // https://developer.mozilla.org/en/DOM/window.navigator.mozBattery
  // By: Paul Sayre
  Modernizr.addTest('battery-api',
    !!prefixed('battery', navigator)
  );
});
