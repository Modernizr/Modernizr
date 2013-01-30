define(['tests'], function ( tests ) {
  var ModernizrProto = {
    // The current version, dummy
    _version : 'v3.0.0pre',

    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config : {
      classPrefix : '',
      enableClasses : true
    },

    _q : [],

    addTest : function( name, fn, options ) {
      tests.push({name : name, fn : fn, options : options });
    },

    addAsyncTest : function (fn) {
      tests.push({name : null, fn : fn})
    }
  };

  return ModernizrProto;
});
