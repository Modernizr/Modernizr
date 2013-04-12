/*!
{
  "name": "ES5 Sham",
  "property": "es5sham",
  "notes": [{
    "name": "ES5 Shim documentation",
    "href": "https://github.com/kriskowal/es5-shim"
  }, {
    "name": "ECMAScript 5.1 Language Specification",
    "href": "http://www.ecma-international.org/ecma-262/5.1/"
  }]
}
!*/
/* DOC

Check if browser needs ES5 Sham (true) or if it already implements ES5 (false).

*/
define(['Modernizr'], function(Modernizr) {
  // es5sham
  // test by @jokeyrhyme
  Modernizr.addTest('es5sham', function() {
    return !(Object.create &&
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
      Object.preventExtensions);
  });
});
