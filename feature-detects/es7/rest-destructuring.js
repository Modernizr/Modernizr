/*!
{
  "name": "ES7 Rest destructuring",
  "property": ["restdestructuringarray", "restdestructuringobject"],
  "caniuse" : "destructuring%20assignment",
  "notes": [{
    "name": "official ECMAScript 7 Destructuring Assignment draft specification",
    "href": "https://tc39.es/ecma262/#sec-destructuring-assignment"
  }],
  "authors": ["dabretin"],
  "warnings": ["ECMAScript 7 is still a only a draft, so this detect may not match the final specification or implementations."],
  "tags": ["es7"]
}
!*/
/* DOC
Check if browser implements ECMAScript 7 Destructuring Assignment per specification.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('restdestructuringarray', function() {
    try {
      // eslint-disable-next-line
      eval('var [...rest]=[1]');
    } catch (e) {
      return false;
    }
    return true;
  });
  Modernizr.addTest('restdestructuringobject', function() {
    try {
      // eslint-disable-next-line
      eval('var {...rest}={a:1}');
    } catch (e) {
      return false;
    }
    return true;
  });
});
