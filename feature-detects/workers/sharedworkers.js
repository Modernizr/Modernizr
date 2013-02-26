define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('sharedworkers', !!window.SharedWorker);
});
