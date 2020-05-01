/*!
{
  "name": "ES7 Rest destructuring",
  "property": ["restdestructuringarray", "restdestructuringobject"],
  "caniuse" : "destructuring%20assignment",
  "notes": [{
    "name": "ECMAScript Destructuring Assignment Specification",
    "href": "https://tc39.es/ecma262/#sec-destructuring-assignment"
  }],
  "authors": ["dabretin"],
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
