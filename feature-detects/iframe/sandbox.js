/*!
{
  "name": "iframe[sandbox] Attribute",
  "property": "sandbox",
  "caniuse": "iframe-sandbox",
  "tags": ["iframe"],
  "builderAliases": ["iframe_sandbox"],
  "notes": [
  {
    "name": "WHATWG Spec",
    "href": "https://html.spec.whatwg.org/multipage/embedded-content.html#attr-iframe-sandbox"
  }],
  "knownBugs": ["False-positive on Firefox < 29"]
}
!*/
/* DOC
Test for `sandbox` attribute in iframes.
*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';

Modernizr.addTest('sandbox', 'sandbox' in createElement('iframe'));

export default Modernizr.sandbox
