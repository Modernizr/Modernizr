/*!
{
  "name": "Template strings",
  "property": "templatestrings",
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Browser_compatibility"
  }]
}
!*/
/* DOC
Template strings are string literals allowing embedded expressions.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('templatestrings', function() {
    var supports;
    try {
      // A number of tools, including uglifyjs and require, break on a raw "`", so
      // use an eval to get around that.
      // eslint-disable-next-line
      eval('``');
      supports = true;
    } catch (e) {}
    return !!supports;
  });
});
