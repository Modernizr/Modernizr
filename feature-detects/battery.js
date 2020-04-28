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
import Modernizr from '../src/Modernizr.js';
import _globalThis from '../src/globalThis.js';
import prefixed from '../src/prefixed.js';
var navigator = _globalThis.navigator

Modernizr.addTest('batteryapi', navigator && !!prefixed('battery', navigator) || !!prefixed('getBattery', navigator), {
  aliases: ['battery-api']
});

export default Modernizr.batteryapi;
