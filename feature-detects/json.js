/*!
{
  "name": "JSON",
  "property": "json",
  "caniuse": "json",
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Glossary/JSON"
  }],
  "polyfills": ["json2"]
}
!*/
/* DOC
Detects native support for JSON handling functions.
*/
import Modernizr from '../src/Modernizr.js';
import _globalThis from '../src/globalThis.js';

// this will also succeed if you've loaded the JSON2.js polyfill ahead of time
//   ... but that should be obvious. :)

Modernizr.addTest('json', 'JSON' in _globalThis && 'parse' in JSON && 'stringify' in JSON);

export default Modernizr.json
