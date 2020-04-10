/*!
{
  "name": "ES8 Object",
  "property": "es8object",
  "notes": [{
    "name": "ECMAScript 8 draft specification: Object.entries",
    "href": "https://www.ecma-international.org/ecma-262/8.0/#sec-object.entries"
  }, {
    "name": "ECMAScript 8 draft specification: Object.values",
    "href": "https://www.ecma-international.org/ecma-262/8.0/#sec-object.values"
  }],
  "caniuse": "object-entries,object-values",
  "authors": ["dabretin"],
  "warnings": ["ECMAScript 8 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es8"]
}
!*/
/* DOC
Check if browser implements ECMAScript 8 Object.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('es8object', !!(Object.entries &&
    Object.values));
});
