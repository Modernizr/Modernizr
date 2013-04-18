define(['is'], function( is ) {
  var getStyle = function( node, pseudoEl ) {
    // Use the document's default view (if supported — IE9+) for correct scoping
    var win = document.defaultView || window;
    return win.getComputedStyle ? win.getComputedStyle(node, is(pseudoEl, 'undefined') ? null : pseudoEl)
                                                 : node.currentStyle;
  };
  return getStyle;
});
