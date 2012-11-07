define(['Modernizr'], function( Modernizr ) {
  // code.google.com/speed/webp/
  // by rich bradshaw, ryan seddon, and paul irish

  // This test is asynchronous. Watch out.

  Modernizr.addAsyncTest(function(){
    var image = new Image();

    image.onerror = function() {
      Modernizr.addTest('webp', false);
    };

    image.onload = function() {
      Modernizr.addTest('webp', image.width == 1);
    };

    image.src = 'data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAAAUAgCdASoBAAEAL/3+/3+CAB/AAAFzrNsAAP5QAAAAAA==';
  });
});
