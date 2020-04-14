/*!
{
  "name": "textarea maxlength",
  "property": "textareamaxlength",
  "aliases": ["textarea-maxlength"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea"
  }],
  "polyfills": ["maxlength"]
}
!*/
/* DOC
Detect support for the maxlength attribute of a textarea element
*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';

Modernizr.addTest('textareamaxlength', !!('maxLength' in createElement('textarea')));

export default Modernizr.textareamaxlength
