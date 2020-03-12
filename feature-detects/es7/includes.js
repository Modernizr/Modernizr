define(['Modernizr', 'is'], function(Modernizr, is) {
  Modernizr.addTest('includes', is(Array.prototype.includes, 'function'));
});
