define(['Modernizr', 'testStyles'], function( Modernizr, testStyles ) {
  // CSS generated content detection
  // Android won't return correct height for anything below 7px #738
  testStyles('#modernizr{font:0/0 a}#modernizr:after{content:":)";visibility:hidden;font:7px/1 a}', function( node ) {
    Modernizr.addTest('generatedcontent', node.offsetHeight >= 7);
  });
});
