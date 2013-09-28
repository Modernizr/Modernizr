/*!
{
  "name": "style[scoped]",
  "property": "stylescoped",
  "caniuse": "style-scoped",
  "tags": ["dom"],
  "authors": ["Cătălin Mariș"],
  "notes": [{
    "name": "WHATWG Specification",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/semantics.html#attr-style-scoped"
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
