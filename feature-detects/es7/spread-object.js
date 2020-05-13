/*!
{
  "name": "ES7 Spread object",
  "property": "spreadobject",
  "notes": [{
    "name": "ECMAScript array Specification",
    "href": "http://www.ecma-international.org/ecma-262/#sec-object-initializer"
  }],
  "authors": ["dabretin"],
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
