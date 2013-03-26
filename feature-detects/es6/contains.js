define(['Modernizr'], function( Modernizr ) {
  // ES6: String.prototype.contains
  // By Robert Kowalski
  Modernizr.addTest('contains', is(String.prototype.contains, 'function'));
});