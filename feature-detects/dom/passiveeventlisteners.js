/*!
{
  "property": "passiveeventlisteners",
  "caniuse": "passive-event-listener",
  "tags": ["dom"],
  "authors": ["Rick Byers"],
  "name": "Passive event listeners",
  "caniuse": "passive-event-listener",
  "notes": [{
    "name": "WHATWG Spec",
    "href": "https://dom.spec.whatwg.org/#dom-addeventlisteneroptions-passive"
  }, {
    "name": "WICG explainer",
    "href": "https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md"
  }]
}
!*/
/* DOC
Detects support for the passive option to addEventListener.
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('passiveeventlisteners', function() {
  var supportsPassiveOption = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassiveOption = true;
        return;
      }
    });
    var noop = function () {};
    _globalThis.addEventListener('testPassiveEventSupport', noop, opts);
    _globalThis.removeEventListener('testPassiveEventSupport', noop, opts);
  } catch (e) {}
  return supportsPassiveOption;
});

export default Modernizr.passiveeventlisteners
