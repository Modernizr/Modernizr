/*!
{
  "name": "CSS Stylable Scrollbars",
  "caniuse": "",X
  "property": "cssscrollbar",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'testStyles', 'prefixes'], function( Modernizr, testStyles, prefixes ) {
  testStyles('#modernizr{overflow: scroll; width: 40px; height: 40px; }#' + prefixes
    .join('scrollbar{width:0px}'+' #modernizr::')
    .split('#')
    .slice(1)
    .join('#') + 'scrollbar{width:0px}',
  function( node ) {
    Modernizr.addTest('cssscrollbar', node.scrollWidth == 40);
  });
});
