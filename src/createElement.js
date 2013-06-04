define(function() {
  var createElement = function() {
    return document.createElement.apply(document, arguments);
  };
  return createElement;
});
