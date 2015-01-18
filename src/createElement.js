define(function() {
  var createElement = function() {
    if (typeof document.createElement !== 'function') {
      // This is the case in IE7, where the type of createElement is "object".
      // For this reason, we cannot call apply() as Object is not a Function.
      return document.createElement(arguments[0]);
    } else {
      return document.createElement.apply(document, arguments);
    }
  };
  return createElement;
});
