/*!
{
  "name": "QuerySelector",
  "property": "queryselector",
  "caniuse": "queryselector",
  "tags": ["queryselector"],
  "authors": ["Andrew Betts (@triblondon)"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/selectors-api/#queryselectorall"
  }],
  "polyfills": ["css-selector-engine"]
}
!*/
/* DOC
Detects support for querySelector.
*/
import Modernizr from '../src/Modernizr.js';
import isBrowser from '../src/isBrowser.js';

Modernizr.addTest('queryselector', isBrowser && 'querySelector' in document && 'querySelectorAll' in document);

export default Modernizr.queryselector
