define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // dev.opera.com/articles/view/css3-object-fit-object-position/
  Modernizr.addTest('objectfit', !!prefixed('objectFit'), { aliases: ['object-fit'] });
});
