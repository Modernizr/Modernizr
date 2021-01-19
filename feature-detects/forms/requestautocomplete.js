/*!
{
  "name": "form#requestAutocomplete()",
  "property": "requestautocomplete",
  "tags": ["form", "forms", "requestAutocomplete", "payments"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://wiki.whatwg.org/wiki/RequestAutocomplete"
  }]
}
!*/
/* DOC
When used with input[autocomplete] to annotate a form, form.requestAutocomplete() shows a dialog in Chrome that speeds up
checkout flows (payments specific for now).
*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';
import prefixed from '../../src/prefixed.js';

Modernizr.addTest('requestautocomplete', !!prefixed('requestAutocomplete', createElement('form')));

export default Modernizr.requestautocomplete
