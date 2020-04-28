/*!
{
  "name": "postMessage",
  "property": "postmessage",
  "caniuse": "x-doc-messaging",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/webmessaging/#crossDocumentMessages"
  }],
  "polyfills": ["easyxdm", "postmessage-jquery"],
  "knownBugs": ["structuredclones - Android 2&3 can not send a structured clone of dates, filelists or regexps"],
  "warnings": ["Some old WebKit versions have bugs. Stick with object, array, number and pixeldata to be safe."]
}
!*/
/* DOC
Detects support for the `self.postMessage` protocol for cross-document messaging.
`Modernizr.postmessage.structuredclones` reports if `postMessage` can send objects.
*/
import Modernizr from '../src/Modernizr.js';
import _globalThis from '../src/globalThis.js';

var bool = true;

try {
  _globalThis.postMessage({ toString: function () { bool = false; } }, '*');
} catch (e) {
}

Modernizr.addTest('postmessage', new Boolean('postMessage' in _globalThis));
Modernizr.addTest('postmessage.structuredclones', bool);

export default Modernizr.postmessage
