// code.google.com/speed/webp/
// by rich bradshaw, ryan seddon, and paul irish


// This test is ascynchronous. Watch out.

(function(){

  var image = new Image();


  image.onerror = function() {
      Modernizr.addTest('webp', function () { return false; });
  };  
  image.onload = function() {
      Modernizr.addTest('webp', function () { return image.width == 4; });
  };

  image.src = 'data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAAAQAgCdASoEAAQAAAcIhYWIhYSIgIIADA1gAAUAAAEAAAEAAP7%2F2fIAAAAA';

})();

