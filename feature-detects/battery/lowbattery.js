/*!
{
  "name": "Low Battery Level",
  "property": "lowbattery",
  "aliases": [],
  "tags": ["hardware", "mobile"],
  "knownBugs": [],
  "doc" : null,
  "authors": ["Paul Sayre"],
  "references": [{
    "name": "MDN Docs",
    "href": "http://developer.mozilla.org/en/DOM/window.navigator.mozBattery"
  }]
}
!*/
define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // Enable a developer to remove CPU intensive CSS/JS when battery is low

  Modernizr.addTest('lowbattery', function() {
    var minLevel = 0.20;
    var battery = prefixed('battery', navigator);
    return !!(battery && !battery.charging && battery.level <= minLevel);
  });
});
