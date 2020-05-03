/*!
{
  "name": "ES6 Array",
  "property": "es6array",
  "notes": [{
    "name": "ECMAScript 6 specification",
    "href": "https://www.ecma-international.org/ecma-262/6.0/index.html"
  }, {
    "name": "Last ECMAScript specification",
    "href": "https://www.ecma-international.org/ecma-262/index.html"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Array per specification.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('es6array', !!(Array.prototype &&
    Array.prototype.copyWithin &&
    Array.prototype.fill &&
    Array.prototype.find &&
    Array.prototype.findIndex &&
    Array.prototype.keys &&
    Array.prototype.entries &&
    Array.prototype.values &&
    Array.from &&
    Array.of));
});
