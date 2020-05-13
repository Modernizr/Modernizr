/*!
{
  "name": "ES6 Collections",
  "property": "es6collections",
  "notes": [{
    "name": "ECMAScript 6 specification",
    "href": "https://www.ecma-international.org/ecma-262/6.0/index.html"
  }, {
    "name": "Last ECMAScript specification",
    "href": "https://www.ecma-international.org/ecma-262/index.html"
  }],
  "polyfills": ["es6shim", "weakmap"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Map, Set, WeakMap and WeakSet
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('es6collections', !!(
    window.Map && window.Set && window.WeakMap && window.WeakSet
  ));
});
