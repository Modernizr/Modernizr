define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // by james a rosen.
  // https://github.com/Modernizr/Modernizr/issues/258

  Modernizr.addTest('createelementattrs', function() {
    try {
      return createElement('<input name="test" />').getAttribute('name') == 'test';
    } catch( e ) {
      return false;
    }
  }, {
    aliases: ['createelement-attrs']
  });
});
