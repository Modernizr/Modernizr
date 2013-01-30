define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // <time> element
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/rendering.html#the-time-element-0
  Modernizr.addTest('time', 'valueAsDate' in createElement('time'));
});
