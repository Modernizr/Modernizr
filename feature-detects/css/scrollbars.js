define(['Modernizr', 'testStyles', 'prefixes'], function( Modernizr, testStyles, prefixes ) {
  // Stylable scrollbars detection
  testStyles('#modernizr{overflow: scroll; width: 40px; height: 40px; }#' + prefixes
    .join('scrollbar{width:0px}'+' #modernizr::')
    .split('#')
    .slice(1)
    .join('#') + 'scrollbar{width:0px}',
  function( node ) {
    Modernizr.addTest('cssscrollbar', node.scrollWidth == 40);
  });
});
