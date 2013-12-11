/*!
{
  "name": "input formenctype",
  "property": "inputformenctype",
  "aliases": ["input-formenctype"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#attr-fs-formenctype"
  }, {
    "name": "Wufoo demo",
    "href": "http://www.wufoo.com/html5/attributes/16-formenctype.html"
  }],
  "polyfills": [
    "html5formshim"
  ]
}
!*/
/* DOC

Detect support for the formenctype attribute on form inputs, which overrides the form enctype attribute

*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('inputformenctype', !!('formEnctype' in createElement('input')), { aliases: ['input-formenctype'] });
});
