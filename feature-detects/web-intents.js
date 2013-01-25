define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // Tests for the ability to use Web Intents (http://webintents.org).
  // By Eric Bidelman
  Modernizr.addTest('webintents', !!prefixed('startActivity', navigator));
});
