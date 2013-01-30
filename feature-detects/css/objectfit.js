define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // dev.opera.com/articles/view/css3-object-fit-object-position/
  Modernizr.addTest('object-fit',
    !!prefixed('objectFit')
  );
});
