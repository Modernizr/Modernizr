/*!
{
  "name": "Orientation and Motion Events",
  "property": ["devicemotion", "deviceorientation"],
  "caniuse": "deviceorientation",
  "notes": [{
    "name": "W3C Editor's Draft Spec",
    "href": "https://w3c.github.io/deviceorientation/"
  }, {
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation"
  }],
  "authors": ["Shi Chuan"],
  "tags": ["event"],
  "builderAliases": ["event_deviceorientation_motion"]
}
!*/
/* DOC
Part of Device Access aspect of HTML5, same category as geolocation.

`devicemotion` tests for Device Motion Event support, returns boolean value true/false.

`deviceorientation` tests for Device Orientation Event support, returns boolean value true/false
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

var result = {
  'devicemotion': 'DeviceMotionEvent' in _globalThis,
  'deviceorientation': 'DeviceOrientationEvent' in _globalThis
}

Modernizr.addTest('devicemotion', result.devicemotion);
Modernizr.addTest('deviceorientation', result.deviceorientation);

export default result
