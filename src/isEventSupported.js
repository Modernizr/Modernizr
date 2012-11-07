define(['ModernizrProto', 'createElement'], function( ModernizrProto, createElement ) {
  // isEventSupported determines if a given element supports the given event
  // kangax.github.com/iseventsupported/
  //
  // The following results are known incorrects:
  //   Modernizr.hasEvent("webkitTransitionEnd", elem) // false negative
  //   Modernizr.hasEvent("textInput") // in Webkit. github.com/Modernizr/Modernizr/issues/333
  var isEventSupported = (function() {

    var TAGNAMES = {
      'select': 'input', 'change': 'input',
      'submit': 'form', 'reset': 'form',
      'error': 'img', 'load': 'img', 'abort': 'img'
    };

    function isEventSupportedInner( eventName, element ) {

      element = element || createElement(TAGNAMES[eventName] || 'div');
      eventName = 'on' + eventName;

      // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
      var isSupported = eventName in element;

      if ( !isSupported ) {
        // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
        if ( !element.setAttribute ) {
          element = createElement('div');
        }
        if ( element.setAttribute && element.removeAttribute ) {
          element.setAttribute(eventName, '');
          isSupported = is(element[eventName], 'function');

          // If property was created, "remove it" (by setting value to `undefined`)
          if ( !is(element[eventName], 'undefined') ) {
            element[eventName] = undefined;
          }
          element.removeAttribute(eventName);
        }
      }

      element = null;
      return isSupported;
    }
    return isEventSupportedInner;
  })();

  return isEventSupported;
});
