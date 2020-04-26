/*!
{
  "name": "Ambient Light Events",
  "property": "ambientlight",
  "caniuse": "ambient-light",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/ambient-light/"
  }]
}
!*/
/* DOC
Detects support for the API that provides information about the ambient light levels, as detected by the device's light detector, in terms of lux units.
*/
import Modernizr from '../src/Modernizr.js';
import hasEvent from '../src/hasEvent.js';
import _globalThis from '../src/globalThis.js';

Modernizr.addTest('ambientlight', hasEvent('devicelight', _globalThis));

export default Modernizr.ambientlight;
