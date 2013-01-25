define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // Dart
  // By Theodoor van Donge
  // https://chromiumcodereview.appspot.com/9232049/

  Modernizr.addTest('dart', !!prefixed('startDart', navigator));
});
