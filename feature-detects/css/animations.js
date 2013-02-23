define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  // Note, Android < 4 will pass this test, but can only animate
  //   a single property at a time
  //   http://goo.gl/CHVJm
  Modernizr.addTest('cssanimations', function() {
    return testAllProps('animationName');
  });
});
