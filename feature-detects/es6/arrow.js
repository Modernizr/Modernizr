/*!
{
  "name": "ES6 Arrow Functions",
  "property": "arrow",
  "authors": ["Vincent Riemer"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Arrow Functions per specification.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('arrow', function() {
    try {
      /* jshint evil: true */
      eval('()=>{}');
    } catch (e) {
      return false;
    }
    return true;
  });
});
