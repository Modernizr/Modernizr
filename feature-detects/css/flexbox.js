define(['Modernizr', 'testAllProps', 'nativeCSSDetect'], function( Modernizr, testAllProps, nativeCSSDetect ) {
  // The *new* flexbox
  // dev.w3.org/csswg/css3-flexbox
  Modernizr.addTest('flexbox', function () {
    var result = nativeCSSDetect('flex-wrap', 'wrap', true);
    if (typeof result !== 'undefined') {
        return result;
    }
    // Failing that, do it the old way
    return testAllProps('flexWrap');
  });
});
