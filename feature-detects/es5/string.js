/*!
{
  "name": "ES5 String",
  "property": "es5string",
  "notes": [{
    "name": "ECMAScript 5.1 Language Specification",
    "href": "http://www.ecma-international.org/ecma-262/5.1/"
  }],
  "polyfills": [{
    "name": "ES5 Shim",
    "href": "https://github.com/kriskowal/es5-shim"
  }],
  "async": false,
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "knownBugs": [],
  "tags": []
}
!*/
/* DOC

Check if browser implements ECMAScript 5 String per specification.

*/
define(['Modernizr'], function (Modernizr) {
  // es5string
  // test by @jokeyrhyme
  Modernizr.addTest('es5string', function () {
    return String.prototype && String.prototype.trim;
  });
});
