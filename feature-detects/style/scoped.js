/*!
{
  "name": "style[scoped]",
  "property": "stylescoped",
  "caniuse": "style-scoped",
  "tags": ["dom"],
  "authors": ["@alrra"],
  "notes": [{
    "name": "W3C spec",
    "href": "http://www.w3.org/TR/html5/the-style-element.html#attr-style-scoped"
  }],
  "polyfills": ["scoped-styles"]
}
!*/
/* DOC

Support for the `scoped` attribute of the `<style>` element.

*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('stylescoped', 'scoped' in createElement('style'));
});
