/*!
{
  "name": "ES5 String.prototype.contains",
  "property": "contains",
  "authors": ["Robert Kowalski"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 `String.prototype.contains` per specification.
*/
import Modernizr from '../../src/Modernizr.js';
import is from '../../src/is.js';

Modernizr.addTest('contains', is(String.prototype.contains, 'function'));

export default Modernizr.contains
