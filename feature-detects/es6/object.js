/*!
{
  "name": "ES6 Object",
  "property": "es6object",
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
Check if browser implements ECMAScript 6 Object per specification.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('es6object', !!(Object.assign &&
    Object.is &&
    Object.setPrototypeOf));
});
