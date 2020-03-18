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
  "caniuse": "spread array",
  "authors": ["dabretin"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 spread syntax (in array and function calls)
WARNING: not for object literals (=> ES7) 
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
