/*!
{
  "name": "ES7 Array",
  "property": "es7array",
  "notes": [{
    "name": "official ECMAScript 7 array draft specification",
    "href": "https://tc39.es/ecma262/#sec-array.prototype.includes"
  }],
  "authors": ["dabretin"],
  "warnings": ["ECMAScript 7 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es7"]
}
!*/
/* DOC
Check if browser implements ECMAScript 7 Array per specification.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('es7array', !!(Array.prototype &&
    Array.prototype.includes));
});
