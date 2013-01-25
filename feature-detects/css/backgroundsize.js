define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
// This will false positive in Opera Mini
// github.com/Modernizr/Modernizr/issues/396

Modernizr.addTest('backgroundsize', testAllProps('backgroundSize'));

});
