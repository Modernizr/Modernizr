/*!
{
  "name": "form novalidate attribute",
  "property": "formnovalidate",
  "aliases": ["form-novalidate"],
  "notes": [{
    "name": "html5 doctor article",
    "href": "http://html5doctor.com/html5-forms-introduction-and-new-attributes/#novalidate"
  }, {
    "name": "Wufoo demo",
    "href": "http://www.wufoo.com/html5/attributes/11-novalidate.html"
  }],
  "polyfills": [
    "webshims"
  ]
}
!*/
/* DOC

Detect support for the form novalidate attribute

*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('formnovalidate', !!('noValidate' in createElement('form')), { aliases: ['form-novalidate'] });
});
