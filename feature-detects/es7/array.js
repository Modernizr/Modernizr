/*!
{
  "name": "ES7 Array",
  "property": "es7array",
  "notes": [{
    "name": "ECMAScript array Specification",
    "href": "https://tc39.es/ecma262/#sec-array.prototype.includes"
  }],
  "authors": ["dabretin"],
  "tags": ["es7"]
}
!*/
/* DOC
Check if browser implements ECMAScript 7 Array per specification.
*/
import Modernizr from '../../src/Modernizr.js';

Modernizr.addTest('es7array', !!(Array.prototype && Array.prototype.includes));

export default Modernizr.es7array
