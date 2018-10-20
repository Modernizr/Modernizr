/*!
{
  "property": "passiveeventlisteners",
  "tags": ["dom"],
  "authors": ["Rick Byers"],
  "name": "Passive event listeners",
  "notes": [{
      "name": "WHATWG Spec",
      "href": "https://dom.spec.whatwg.org/#dom-addeventlisteneroptions-passive"
    },{
      "name": "WICG explainer",
      "href": "https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md"
  }]
}
!*/
/* DOC
Detects support for the passive option to addEventListener.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('passiveeventlisteners', function() {
    var supportsPassiveOption = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassiveOption = true;
        }
      });
      var noop = function () {};
      window.addEventListener('testPassiveEventSupport', noop, opts);
      window.removeEventListener('testPassiveEventSupport', noop, opts);
    } catch (e) {}
    return supportsPassiveOption;
  });
});
