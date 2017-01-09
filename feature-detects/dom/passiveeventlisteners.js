/*!
{
  "authors": ["Rick Byers"],
  "name": "Passive event listeners",
  "notes": [
    {
      "name": "WHATWG specification",
      "href": "https://dom.spec.whatwg.org/#dom-addeventlisteneroptions-passive"
    },
    {
      "name": "WICG explainer",
      "href": "https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md"
    }
  ],
  "property": "passiveeventlisteners",
  "tags": ["dom"]
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
      window.addEventListener('test', null, opts);
    } catch (e) {}
    return supportsPassiveOption;
  });
});
