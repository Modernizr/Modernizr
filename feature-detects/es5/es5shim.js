/*!
{
  "name": "ES5 Shim",
  "property": "es5shim",
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

Check if browser needs ES5 Shim (true) or if it already implements ES5 (false).

*/
define(['Modernizr'], function(Modernizr) {
  // es5shim
  // test by @jokeyrhyme
  Modernizr.addTest('es5shim', function() {
    var isoDate = '2013-04-12T06:06:37.307Z',
      canParseISODate = false;
    try {
      canParseISODate = !!Date.parse(isoDate);
    } catch (e) {
      // no ISO date parsing yet
    }
    return !(Array.prototype &&
      Array.prototype.every &&
      Array.prototype.filter &&
      Array.prototype.forEach &&
      Array.prototype.indexOf &&
      Array.prototype.lastIndexOf &&
      Array.prototype.map &&
      Array.prototype.some &&
      Array.prototype.reduce &&
      Array.prototype.reduceRight &&
      Array.isArray &&
      Date.now &&
      Date.prototype &&
      Date.prototype.toISOString &&
      Date.prototype.toJSON &&
      canParseISODate &&
      Function.prototype &&
      Function.prototype.bind &&
      Object.keys &&
      String.prototype &&
      String.prototype.trim);
  });
});
