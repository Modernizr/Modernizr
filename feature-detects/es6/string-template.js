/*!
{
  "name": "ES6 Template Strings",
  "property": "stringtemplate",
  "caniuse": "template-literals",
  "notes": [{
    "name": "ECMAScript 6 draft specification",
    "href": "https://tc39wiki.calculist.org/es6/template-strings/"
  }],
  "authors": ["dabretin"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 String template.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('stringtemplate', function() {
    try {
      // eslint-disable-next-line
      return eval('(function(){var a=1; return `-${a}-`;})()') === '-1-';
    } catch (e) {
      return false;
    }
  });
});
