define(['ModernizrProto', 'createElement'], function( ModernizrProto, createElement ) {
  // isEventSupported determines if a given element supports the given event
  // kangax.github.com/iseventsupported/
  //
  // The following results are known incorrects:
  //   Modernizr.hasEvent("webkitTransitionEnd", elem) // false negative
  //   Modernizr.hasEvent("textInput") // in Webkit. github.com/Modernizr/Modernizr/issues/333
  var isEventSupported = (function (undefined) {

    var TAGNAMES = {
      'select': 'input', 'change': 'input',
      'submit': 'form', 'reset': 'form',
      'error': 'img', 'load': 'img', 'abort': 'img'
    }, 
    
    // Detect whether event support can be detected via `in`. Use a DOM element
    // for the test, with the `blur` event b/c it should always be there. If this
    // is `false` then we need the fallback technique. (bit.ly/event-detection)
    hasEventHandlerProperty = 'onblur' in document.documentElement;

    /**
     * @param  {string|*}           eventName  is the name of an event to test for (e.g. "resize")
     * @param  {(Object|string|*)=} element    is a DOM element|document|window|tagName to test on
     * @return {boolean}
     */
    function isEventSupportedInner( eventName, element ) {

      var isSupported;
      if ( !eventName ) { return false; }
      eventName = 'on' + eventName;
      
      if ( !element || typeof element == 'string' ) {
        element = createElement(element || TAGNAMES[eventName] || 'div');
      } else if ( typeof element != 'object' ) {
        return false; // `element` was invalid type
      }

      // Testing via the `in` operator is sufficient for modern browsers and IE.
      // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and  
      // "resize", whereas `in` "catches" those.
      isSupported = eventName in element;
 
      // Fallback technique for old Firefox - bit.ly/event-detection
      if ( !isSupported && !hasEventHandlerProperty ) {
        if ( !element.setAttribute ) {
          // Switch to generic element if it lacks `setAttribute`.
          // It could be the `document`, `window`, or something else.
          element = createElement('div'); 
        }
        if ( element.setAttribute && element.removeAttribute ) {
          element.setAttribute(eventName, '');
          isSupported = typeof element[eventName] == 'function';

          if ( element[eventName] != null ) {
            // If property was created, "remove it" by setting value to `undefined`.
            element[eventName] = undefined; 
          }
          element.removeAttribute(eventName);
        }
      }

      element = null; // Nullify to prevent memory leak.
      return isSupported;
    }
    return isEventSupportedInner;
  })();

  return isEventSupported;
});
