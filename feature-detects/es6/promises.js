/*!
{
  "name": "ES6 Promises",
  "property": "promises",
  "caniuse": "promises",
  "polyfills": ["es6promises"],
  "authors": ["Krister Kari", "Jake Archibald"],
  "tags": ["es6"],
  "notes": [{
    "name": "The ES6 promises spec",
    "href": "https://github.com/domenic/promises-unwrapping"
  }, {
    "name": "Chromium dashboard - ES6 Promises",
    "href": "https://www.chromestatus.com/features/5681726336532480"
  }, {
    "name": "JavaScript Promises: an Introduction",
    "href": "https://developers.google.com/web/fundamentals/primers/promises/"
  }]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Promises per specification.
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('promises', function() {
  return 'Promise' in _globalThis &&
  // Some of these methods are missing from
  // Firefox/Chrome experimental implementations
  'resolve' in _globalThis.Promise &&
  'reject' in _globalThis.Promise &&
  'all' in _globalThis.Promise &&
  'race' in _globalThis.Promise &&
  // Older version of the spec had a resolver object
  // as the arg rather than a function
  (function() {
    var resolve;
    new _globalThis.Promise(function(r) { resolve = r; });
    return typeof resolve === 'function';
  }());
});

export default Modernizr.promises
