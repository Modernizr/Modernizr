/*!
{
  "name": "ES6 Number",
  "property": "es6number",
  "notes": [{
    "name": "unofficial ECMAScript 6 draft specification",
    "href": "https://web.archive.org/web/20180825202128/https://tc39.github.io/ecma262/"
  }],
  "polyfills": ["es6shim"],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "warnings": ["ECMAScript 6 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Number per specification.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('es6number', !!(Number.isFinite &&
    Number.isInteger &&
    Number.isSafeInteger &&
    Number.isNaN &&
    Number.parseInt &&
    Number.parseFloat &&
    Number.isInteger(Number.MAX_SAFE_INTEGER) &&
    Number.isInteger(Number.MIN_SAFE_INTEGER) &&
    Number.isFinite(Number.EPSILON)));
});
