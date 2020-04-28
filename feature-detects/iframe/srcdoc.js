/*!
{
  "name": "iframe[srcdoc] Attribute",
  "property": "srcdoc",
  "caniuse": "iframe-srcdoc",
  "tags": ["iframe"],
  "builderAliases": ["iframe_srcdoc"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://html.spec.whatwg.org/multipage/embedded-content.html#attr-iframe-srcdoc"
  }]
}
!*/
/* DOC
Test for `srcdoc` attribute in iframes.
*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';

Modernizr.addTest('srcdoc', 'srcdoc' in createElement('iframe'));

export default Modernizr.srcdoc
