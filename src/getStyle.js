define(function() {
  var getStyle = function( node ) {
    return window.getComputedStyle ? getComputedStyle(node, null)
                                   : node.currentStyle;
  };
  return getStyle;
});
