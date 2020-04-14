/*!
{
  "name": "Application Cache",
  "property": "applicationcache",
  "caniuse": "offline-apps",
  "tags": ["storage", "offline"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en/docs/HTML/Using_the_application_cache"
  }],
  "polyfills": ["html5gears"]
}
!*/
/* DOC
Detects support for the Application Cache, for storing data to enable web-based applications run offline.

The API has been [heavily criticized](https://alistapart.com/article/application-cache-is-a-douchebag) and discussions are underway to address this.
*/
import Modernizr from '../src/Modernizr.js';
import _globalThis from '../src/globalThis.js';

Modernizr.addTest('applicationcache', 'applicationCache' in _globalThis);
export default Modernizr.applicationcache;
