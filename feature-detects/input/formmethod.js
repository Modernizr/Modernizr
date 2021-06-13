/*!
{
  "name": "input formmethod",
  "property": "inputformmethod",
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-formmethod"
  }, {
    "name": "Wufoo demo",
    "href": "https://www.wufoo.com/html5/formmethod-attribute/"
  }],
  "polyfills": ["webshims"]
}
!*/
/* DOC
Detect support for the formmethod attribute on form inputs
*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  Modernizr.addTest('inputformmethod', !!('formMethod' in createElement('input')));
});
