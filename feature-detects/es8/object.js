/*!
{
  "name": "ES8 Object",
  "property": "es8object",
  "notes": [{
    "name": "ECMAScript specification: Object.entries",
    "href": "https://www.ecma-international.org/ecma-262/#sec-object.entries"
  }, {
    "name": "ECMAScript specification: Object.values",
    "href": "https://www.ecma-international.org/ecma-262/#sec-object.values"
  }],
  "caniuse": "object-entries,object-values",
  "authors": ["dabretin"],
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
