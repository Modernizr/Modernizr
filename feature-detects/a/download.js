/*!
{
  "name": "a[download] Attribute",
  "property": "adownload",
  "caniuse": "download",
  "tags": ["media", "attribute"],
  "builderAliases": ["a_download"],
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://developers.whatwg.org/links.html#downloading-resources"
  }]
}
!*/
/* DOC
When used on an `<a>`, this attribute signifies that the resource it points to should be downloaded by the browser rather than navigating to it.
*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('adownload', !_globalThis.externalHost && 'download' in createElement('a'));

export default Modernizr.adownload;
