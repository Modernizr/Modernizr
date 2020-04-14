/*!
{
  "name": "Custom Elements API",
  "property": "customelements",
  "caniuse": "custom-elementsv1",
  "tags": ["customelements"],
  "caniuse": "custom-elementsv1",
  "polyfills": ["customelements"],
  "notes": [{
    "name": "Specs for Custom Elements",
    "href": "https://www.w3.org/TR/custom-elements/"
  }]
}
!*/
/* DOC
Detects support for the Custom Elements API, to create custom html elements via js
*/
import Modernizr from '../src/Modernizr.js';
import _globalThis from '../src/globalThis.js';

Modernizr.addTest('customelements', 'customElements' in _globalThis);

export default Modernizr.customelements
