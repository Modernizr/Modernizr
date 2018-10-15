/*!
{
  "name": "ES6 DynamicImport",
  "property": "import",
  "caniuse": "import",
  "polyfills": ["systemjs"],
  "authors": ["Frank Lemanschik"],
  "tags": ["es6"],
  "notes": [{
    "name": "The ES6 Dynamic Import spec",
    "href": "https://developers.google.com/web/updates/2017/11/dynamic-import"
  }]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Dynamic Import per usage.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('dynamic-import', function() {
    try {
		  new Function('import("")');
		  return true;
    } catch (err) {
      return false;
    }
  });
});
