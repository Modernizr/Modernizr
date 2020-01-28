/*!
{
  "name": "ES6 Symbol",
  "property": "es6symbol",
  "caniuse": "mdn-javascript_builtins_symbol",
  "notes": [{
    "name": "Official ECMAScript 6 specification",
    "href": "https://www.ecma-international.org/ecma-262/6.0/#sec-symbol-constructor"
  },{
    "name": "MDN web docs",
    "href": "https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Symbol"
  }],
  "polyfills": ["es6symbol"],
  "authors": ["buhichan (@buhichan)"],
  "tags": ["es6","symbol"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Symbol per specification.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('es6symbol', !!(Symbol &&
    Symbol.for &&
    Symbol.hasInstance &&
    Symbol.isConcatSpreadable &&
    Symbol.iterator &&
    Symbol.keyFor &&
    Symbol.match &&
    Symbol.prototype &&
    Symbol.replace &&
    Symbol.search &&
    Symbol.species &&
    Symbol.split &&
    Symbol.toPrimitive &&
    Symbol.toStringTag &&
    Symbol.unscopables));
});
