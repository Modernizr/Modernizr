/*!
{
  "name": "ES5 Array",
  "property": "es5array",
  "notes": [{
    "name": "ECMAScript 5.1 Language Specification",
    "href": "http://www.ecma-international.org/ecma-262/5.1/"
  }],
  "polyfills": ["es5shim"],
  "async": false,
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "knownBugs": [],
  "tags": []
}
!*/
/* DOC

Check if browser implements ECMAScript 5 Array per specification.

*/
define(['Modernizr'], function (Modernizr) {
  // es5array
  // test by @jokeyrhyme
  Modernizr.addTest('es5array', function () {
    return Array.prototype &&
      Array.prototype.every &&
      Array.prototype.filter &&
      Array.prototype.forEach &&
      Array.prototype.indexOf &&
      Array.prototype.lastIndexOf &&
      Array.prototype.map &&
      Array.prototype.some &&
      Array.prototype.reduce &&
      Array.prototype.reduceRight &&
      Array.isArray;
  });
});
