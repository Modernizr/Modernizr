define(['fnBind'], function() {
  var createElement = document.createElement;
  return createElement.bind(document);
});
