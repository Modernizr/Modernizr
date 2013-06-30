/*!
{
  "name": "Webp Lossless",
  "async": true,
  "property": ["webplossless", "webp-lossless"],
  "tags": ["image"],
  "authors": ["@amandeep", "Rich Bradshaw", "Ryan Seddon", "Paul Irish"],
  "notes": [{
    "name": "Webp Info",
    "href": "http://code.google.com/speed/webp/"
  },{
    "name": "Webp Lossless Spec",
    "href": "https://developers.google.com/speed/webp/docs/webp_lossless_bitstream_specification"
  }]
}
!*/
/* DOC

Tests for lossless webp support.

*/
define(['Modernizr', 'addTest'], function( Modernizr, addTest ) {
  Modernizr.addAsyncTest('webplossless', function(){
    var image = new Image();

    image.onerror = function() {
      addTest('webplossless', false, { aliases: ['webp-lossless'] });
    };

    image.onload = function() {
      addTest('webplossless', image.width == 1, { aliases: ['webp-lossless'] });
    };

    image.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  },{
    aliases: ['webp-lossless']
  });
});
