/*!
{
  "name": "ES5 Date",
  "property": "es5date",
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

Check if browser implements ECMAScript 5 Date per specification.

*/
define(['Modernizr'], function (Modernizr) {
  // es5date
  // test by @jokeyrhyme
  Modernizr.addTest('es5date', function () {
    var isoDate = '2013-04-12T06:06:37.307Z',
      canParseISODate = false;
    try {
      canParseISODate = !!Date.parse(isoDate);
    } catch (e) {
      // no ISO date parsing yet
    }
    return Date.now &&
      Date.prototype &&
      Date.prototype.toISOString &&
      Date.prototype.toJSON &&
      canParseISODate;
  });
});
