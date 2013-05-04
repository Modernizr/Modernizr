define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // Quota Storage Management API
  // This API can be used to check how much quota an origin is using and request more

  // https://dvcs.w3.org/hg/quota/raw-file/tip/Overview.html

  Modernizr.addTest('quotamanagement', function() {
    var tempStorage = prefixed('temporaryStorage', navigator);
    var persStorage = prefixed('persistentStorage', navigator);

    return !!(tempStorage && persStorage);
  });
});
