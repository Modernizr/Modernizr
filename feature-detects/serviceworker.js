/*!
{
  "name": "ServiceWorker API",
  "property": "serviceworker",
  "caniuse": "serviceworkers",
  "notes": [{
    "name": "ServiceWorkers Explained",
    "href": "https://github.com/slightlyoff/ServiceWorker/blob/master/explainer.md"
  }]
}
!*/
/* DOC
ServiceWorkers (formerly Navigation Controllers) are a way to persistently cache resources to built apps that work better offline.
*/
import Modernizr from '../src/Modernizr.js';
import _globalThis from '../src/globalThis.js';

Modernizr.addTest('serviceworker', 'serviceWorker' in _globalThis.navigator);

export default Modernizr.serviceworker
