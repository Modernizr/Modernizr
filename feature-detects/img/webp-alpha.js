/*!
{
  "name": "Webp Alpha",
  "async": true,
  "property": "webpalpha",
  "aliases": ["webp-alpha"],
  "tags": ["image"],
  "authors": ["Krister Kari", "Rich Bradshaw", "Ryan Seddon", "Paul Irish"],
  "notes": [{
    "name": "WebP Info",
    "href": "https://developers.google.com/speed/webp/"
  }, {
    "name": "Article about WebP support",
    "href": "https://optimus.keycdn.com/support/webp-support/"
  }, {
    "name": "Chromium WebP announcement",
    "href": "https://blog.chromium.org/2011/11/lossless-and-transparency-encoding-in.html?m=1"
  }]
}
!*/
/* DOC
Tests for transparent webp support.
*/
define(['Modernizr', 'addTest'], function(Modernizr, addTest) {
  Modernizr.addAsyncTest(function() {
    var image = new Image();

    image.onerror = function() {
      addTest('webpalpha', false, {aliases: ['webp-alpha']});
    };

    image.onload = function() {
      addTest('webpalpha', image.width === 1, {aliases: ['webp-alpha']});
    };

    image.src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==';
  });
});
