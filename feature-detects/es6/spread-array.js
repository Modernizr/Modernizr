/*!
{
  "name": "ES6 Spread array",
  "property": "spreadarray",
  "notes": [{
    "name": "ECMAScript 6 language specification",
    "href": "https://tc39.es/ecma262/#sec-array-initializer"
  },
  {
    "name": "Article",
    "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax"
  }],
  "caniuse": "mdn-javascript_operators_spread_spread_in_arrays",
  "authors": ["dabretin"],
  "warnings": ["not for object literals (implemented in ES7)"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 spread syntax (in array and function calls)
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('spreadarray', function() {
    try {
      // eslint-disable-next-line
      eval('(function f(){})(...[1])');
    } catch (e) {
      return false;
    }
    return true;
  });
});
