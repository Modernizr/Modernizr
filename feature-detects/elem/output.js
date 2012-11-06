define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // <output>
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-button-element.html#the-output-element
  Modernizr.addTest('outputelem', 'value' in createElement('output'));
});
