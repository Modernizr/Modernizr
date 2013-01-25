define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('webworkers', !!window.Worker);
});
