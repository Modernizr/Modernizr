/*!
{
  "name": "ES5 Object",
  "property": "es5object",
  "notes": [{
    "name": "ECMAScript 5.1 Language Specification",
    "href": "http://www.ecma-international.org/ecma-262/5.1/"
  }],
  "polyfills": [{
    "name": "ES5 Shim: only provides Object.keys()",
    "href": "https://github.com/kriskowal/es5-shim"
  }, {
    "name": "ES5 Sham: adds the rest of Object, read carefully before using",
    "href": "https://github.com/kriskowal/es5-shim"
  }],
  "async": false,
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "knownBugs": [],
  "tags": []
}
!*/
/* DOC

Check if browser implements ECMAScript 5 Object per specification.

*/
define(['Modernizr'], function (Modernizr) {
  // es5object
  // test by @jokeyrhyme
  Modernizr.addTest('es5object', function () {
    return Object.keys &&
      Object.create &&
      Object.getPrototypeOf &&
      Object.getOwnPropertyNames &&
      Object.isSealed &&
      Object.isFrozen &&
      Object.isExtensible &&
      Object.getOwnPropertyDescriptor &&
      Object.defineProperty &&
      Object.defineProperties &&
      Object.seal &&
      Object.freeze &&
      Object.preventExtensions;
  });
});
