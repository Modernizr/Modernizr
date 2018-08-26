/*!
{
  "name": "Battery API",
  "property": "batteryapi",
  "aliases": ["battery-api"],
  "builderAliases": ["battery_api"],
  "tags": ["device", "media"],
  "authors": ["Paul Sayre", "Alex Bradley (@abrad1212)"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/DOM/window.navigator.mozBattery"
  }]
}
!*/
/* DOC
Detect support for the Battery API, for accessing information about the system's battery charge level.
*/
define(['Modernizr', 'prefixed'], function(Modernizr, prefixed) {
  Modernizr.addTest('batteryapi', !!prefixed('battery', navigator) || !!prefixed('getBattery', navigator), {aliases: ['battery-api']});
});
