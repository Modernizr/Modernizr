// code.google.com/speed/webp/
// by rich bradshaw, ryan seddon, and paul irish


// This test is asynchronous. Watch out.

(function(){

  var image = new Image();

  image.onerror = function() {
      Modernizr.addTest('webp', false);
  };  
  image.onload = function() {
      Modernizr.addTest('webp', function() { return image.width == 4; });
  };

  image.src = 'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoBAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==';

}());