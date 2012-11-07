define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // Browser support test for <style scoped>
  // http://www.w3.org/TR/html5/the-style-element.html#attr-style-scoped
  //
  // by @alrra

  Modernizr.addTest('stylescoped', 'scoped' in createElement('style'));
});
