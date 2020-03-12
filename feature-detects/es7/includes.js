define(['Modernizr', 'is'], function(Modernizr, is) {
  Modernizr.addTest('contains', is(Array.prototype.includes, 'function'));
});
