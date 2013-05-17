/*!
{
  "name": "form#requestAutocomplete()",
  "property": "requestautocomplete",
  "tags": ["form", "forms", "requestAutocomplete", "payments"],
  "notes": [{
    "name": "WHATWG proposed spec",
    "href": "http://wiki.whatwg.org/wiki/RequestAutocomplete"
  }]
}
!*/
/* DOC

When used with input[autocomplete] to annotate a form, form.requestAutocomplete() shows a dialog in Chrome that speeds up
checkout flows (payments specific for now).

*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  Modernizr.addTest('requestautocomplete', !!Modernizr.prefixed('requestAutocomplete', createElement('form')));
});
