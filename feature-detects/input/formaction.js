/*!
{
  "name": "input formaction",
  "property": "inputformaction",
  "aliases": ["input-formaction"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-formaction"
  }, {
    "name": "Wufoo demo",
    "href": "https://www.wufoo.com/html5/formaction-attribute/"
  }],
  "polyfills": ["webshims"]
}
!*/
/* DOC
Detect support for the formaction attribute on form inputs
*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  Modernizr.addTest('inputformaction', !!('formAction' in createElement('input')), {aliases: ['input-formaction']});
});
