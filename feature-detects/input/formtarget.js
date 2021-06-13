/*!
{
  "name": "input formtarget",
  "property": "inputformtarget",
  "aliases": ["input-formtarget"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-formtarget"
  }, {
    "name": "Wufoo demo",
    "href": "https://www.wufoo.com/html5/formtarget-attribute/"
  }],
  "polyfills": ["html5formshim"]
}
!*/
/* DOC
Detect support for the formtarget attribute on form inputs, which overrides the form target attribute
*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  Modernizr.addTest('inputformtarget', !!('formTarget' in createElement('input')), {aliases: ['input-formtarget']});
});
