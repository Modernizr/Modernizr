/*!
{
  "name": "ES6 Class",
  "property": "es6class",
  "notes": [{
    "name": "ECMAScript 6 language specification",
    "href": "https://www.ecma-international.org/ecma-262/6.0/#sec-class-definitions"
  }],
  "caniuse": "es6-class",
  "authors": ["dabretin"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 class.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('class', function() {
    try {
      // eslint-disable-next-line
      eval('class A{}');
    } catch (e) {
      return false;
    }
    return true;
  });
});
