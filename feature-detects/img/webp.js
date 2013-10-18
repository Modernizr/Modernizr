/*!
{
  "name": "Webp",
  "async": true,
  "property": "webp",
  "tags": ["image"],
  "authors": ["Rich Bradshaw", "Ryan Seddon", "Paul Irish"],
  "notes": [{
    "name": "Webp Info",
    "href": "http://code.google.com/speed/webp/"
  }]
}
!*/
/* DOC

Tests for lossy, non-alpha webp support.

*/
define(['Modernizr', 'addTest'], function( Modernizr, addTest ) {
  Modernizr.addAsyncTest(function(){
    var image = new Image();

    image.onerror = function() {
      addTest('webp', false);
    };

    image.onload = function() {
      addTest('webp', image.width == 1);
    };

    image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
});
