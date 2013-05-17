/*!
{
  "name": "ES5 Function",
  "property": "es5function",
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

Check if browser implements ECMAScript 5 Function per specification.

*/
define(['Modernizr'], function (Modernizr) {
  // es5function
  // test by @jokeyrhyme
  Modernizr.addTest('es5function', function () {
    return Function.prototype && Function.prototype.bind;
  });
});
