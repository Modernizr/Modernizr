// code.google.com/speed/webp/
// tests for lossless webp support, as detailed in https://developers.google.com/speed/webp/docs/webp_lossless_bitstream_specification
// by @amandeep - based off of the img-webp-test

// This test is asynchronous. Watch out.

(function(){

  var image = new Image();

  image.onerror = function() {
      Modernizr.addTest('webp-lossless', false);
  };
  image.onload = function() {
      Modernizr.addTest('webp-lossless', function() { return image.width == 1; });
  };

  image.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';

}());
