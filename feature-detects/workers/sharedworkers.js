/*!
{
  "name": "Shared Workers",
  "property": "sharedworkers",
  "caniuse": "sharedworkers",
  "tags": ["performance", "workers"],
  "builderAliases": ["workers_sharedworkers"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/workers/"
  }]
}
!*/
/* DOC
Detects support for the `SharedWorker` API from the Web Workers spec.
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('sharedworkers', 'SharedWorker' in _globalThis);

export default Modernizr.sharedworkers
