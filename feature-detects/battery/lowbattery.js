/*!
{
  "name": "Low Battery Level",
  "property": "lowbattery",
  "tags": ["hardware", "mobile"],
  "builderAliases": ["battery_level"],
  "authors": ["Paul Sayre"],
  "notes": [{
    "name": "MDN Docs",
    "href": "http://developer.mozilla.org/en/DOM/window.navigator.mozBattery"
  }],
  "warnings": "If the Battery API is not supported, this detect will return `false` even when the device battery is low."
}
!*/
/* DOC
Detects whether the battery is low, if the Battery API is supported, e.g. to remove CPU intensive CSS/JS.
*/
define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  Modernizr.addTest('lowbattery', function() {
    var minLevel = 0.20;
    var battery = prefixed('battery', navigator);
    return !!(battery && !battery.charging && battery.level <= minLevel);
  });
});
