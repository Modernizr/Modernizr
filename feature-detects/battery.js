define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // Battery API
  // https://developer.mozilla.org/en/DOM/window.navigator.mozBattery
  // By: Paul Sayre
  Modernizr.addTest('batteryapi', !!prefixed('battery', navigator), { aliases: ['battery-api'] });
});
