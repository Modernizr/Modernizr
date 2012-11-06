define(['Modernizr', 'docElement'], function( Modernizr, docElement ) {
  // classList
  // https://developer.mozilla.org/en/DOM/element.classList
  Modernizr.addTest('classlist', 'classList' in docElement);
});
