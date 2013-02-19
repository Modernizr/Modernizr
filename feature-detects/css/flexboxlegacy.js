define(['Modernizr', 'testAllProps', 'nativeCSSDetect'], function( Modernizr, testAllProps, nativeCSSDetect ) {
  // The *old* flexbox
  // www.w3.org/TR/2009/WD-css3-flexbox-20090723/
  Modernizr.addTest('flexboxlegacy', function () {
    var result = nativeCSSDetect('box-direction', 'reverse', true);
    if (typeof result !== 'undefined') {
        return result;
    }
    // Failing that, do it the old way
    return testAllProps('boxDirection');
  });
});
