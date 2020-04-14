/*!
{
  "name": "XDomainRequest",
  "property": "xdomainrequest",
  "tags": ["cors", "xdomainrequest", "ie9", "ie8"],
  "authors": ["Ivan Pan (@hypotenuse)"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest"
  }]
}
!*/
/* DOC
Detects support for XDomainRequest in IE9 & IE8
*/
import Modernizr from '../src/Modernizr.js';
import _globalThis from '../src/globalThis.js';

Modernizr.addTest('xdomainrequest', 'XDomainRequest' in _globalThis);

export default Modernizr.xdomainrequest
