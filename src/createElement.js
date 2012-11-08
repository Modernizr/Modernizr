define(['fnBind'], function() {
  var createElement = document.createElement.bind(document);
  return createElement;
});
