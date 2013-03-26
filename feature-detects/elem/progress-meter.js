define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  //By Stefan Wallin

  //tests for progressbar-support. All browsers that don't support progressbar returns undefined =)
  Modernizr.addTest('progressbar', createElement('progress').max !== undefined);

  //tests for meter-support. All browsers that don't support meters returns undefined =)
  Modernizr.addTest('meter', createElement('meter').max !== undefined);
});
