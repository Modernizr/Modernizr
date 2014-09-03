define(function() {
  var createElement = function() {
    if (typeof document.createElement !== 'function') {
      var oldCreateElement = document.createElement;
      document.createElement = function (tagName) {
        return oldCreateElement(tagName);
      };
    }
    return document.createElement.apply(document, arguments);
  };
  return createElement;
});
