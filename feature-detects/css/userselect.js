define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  // -moz-user-select:none test.
  // by ryan seddon
  //https://github.com/Modernizr/Modernizr/issues/250

  Modernizr.addTest('userselect', testAllProps('userSelect'));
});
