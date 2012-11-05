define(['createElement'], function(createElement) {
  /**
   * Create our "modernizr" element that we do most feature tests on.
   */
  var mod = 'modernizr';
  var modElem = createElement(mod);

  return modElem;
});
