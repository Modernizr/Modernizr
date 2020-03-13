/*!
{
  "name": "ES7 Rest destructuring",
  "property": "restdestructuring",
  "notes": [{
    "name": "official ECMAScript 7 Destructuring Assignement draft specification",
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
  Modernizr.addTest('restdestructuring', function() {
  try {
  // eslint-disable-next-line
    eval('var {...rest}={a:1}');
  } catch (e) {
    return false;
  }
  return true;
  });
});
