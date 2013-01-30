define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // https://developer.mozilla.org/en-US/docs/API/Pointer_Lock_API
  Modernizr.addTest('pointerlock', !!prefixed('pointerLockElement', document));
});
