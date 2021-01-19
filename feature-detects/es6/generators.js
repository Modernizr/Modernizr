/*!
{
  "name": "ES6 Generators",
  "property": "generators",
  "authors": ["Michael Kachanovskyi"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Generators per specification.
*/
import Modernizr from '../../src/Modernizr.js';

Modernizr.addTest('generators', function() {
  try {
    new Function('function* test() {}')();
  } catch (e) {
    return false;
  }
  return true;
});

export default Modernizr.generators
