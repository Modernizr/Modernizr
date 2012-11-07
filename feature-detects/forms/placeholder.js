define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // testing for placeholder attribute in inputs and textareas
  Modernizr.addTest('placeholder', !!('placeholder' in createElement('input') && 'placeholder' in createElement('textarea')));
});
