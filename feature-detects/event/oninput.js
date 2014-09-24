/*!
{
  "name": "onInput Event",
  "property": "oninput",
  "notes": [{
    "name": "MDN article",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers.oninput"
  },{
    "name": "WHATWG spec",
    "href": "http://www.whatwg.org/specs/web-apps/current-work/multipage/common-input-element-attributes.html#common-event-behaviors"
  },{
    "name": "Detecting onInput support",
    "href": "http://danielfriesen.name/blog/2010/02/16/html5-browser-maze-oninput-support"
  }],
  "authors": ["Patrick Kettner"],
  "tags": ["event"]
}
!*/
/* DOC
`oninput` tests if the browser is able to detect the input event
*/
define(['Modernizr', 'docElement', 'createElement', 'testStyles', 'hasEvent'], function( Modernizr, docElement, createElement, testStyles, hasEvent ) {

  Modernizr.addTest('oninput', function() {
    var input = createElement('input');
    input.setAttribute('oninput', 'return');

    if (hasEvent('oninput', docElement) || typeof input.oninput == 'function') {
      return true;
    }

    // IE doesn't support onInput, so we wrap up the non IE APIs
    // (createEvent, addEventListener) in a try catch, rather than test for
    // their trident equivalent.
    try {
      // Older Firefox didn't map oninput attribute to oninput property
      var testEvent;

      var supportsOnInput = false;
      var handler = function(e) {
        supportsOnInput = true;
        e.preventDefault();
        e.stopPropagation();
      };

      docElement.appendChild(input);
      input.focus();

      if (document.createEvent)  {
        testEvent = document.createEvent('KeyboardEvent');
        testEvent.initKeyEvent('keypress', true, true, window, false, false, false, false, 0, 'e'.charCodeAt(0));
        input.addEventListener('input', handler, false);
        input.dispatchEvent(testEvent);
        input.removeEventListener('input', handler, false);
      } else {
        testEvent = document.createEventObject();
        testEvent.altKey = false;
        testEvent.ctrlKey = false;
        testEvent.shiftKey = false;
        testEvent.keyCode = 'e'.charCodeAt(0);
        testEvent.type = 'keypress';
        input.attachEvent('oninput', handler);
        input.fireEvent('onkeypress', testEvent);
        input.detachEvent('oninput', handler);
      }
      docElement.removeChild(input);
      return supportsOnInput;
    } catch (e) {}
  });
});
