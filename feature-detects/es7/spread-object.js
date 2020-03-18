/*!
{
  "name": "ES7 Spread object",
  "property": "spreadobject",
  "notes": [{
    "name": "official ECMAScript 7 array draft specification",
    "href": "http://www.ecma-international.org/ecma-262/9.0/#sec-object-initializer"
  }],
  "authors": ["dabretin"],
  "warnings": ["ECMAScript 7 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es7"]
}
!*/
/* DOC
Check if browser implements ECMAScript 7 object spread syntax 
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('spreadobject', function() {
    try {
      // eslint-disable-next-line
      eval('var a={...{b:1}}');
    } catch (e) {
      return false;
    }
    return true;
  });
});
