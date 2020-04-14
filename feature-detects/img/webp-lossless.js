/*!
{
  "name": "Webp Lossless",
  "async": true,
  "property": ["webplossless", "webp-lossless"],
  "tags": ["image"],
  "authors": ["@amandeep", "Rich Bradshaw", "Ryan Seddon", "Paul Irish"],
  "notes": [{
    "name": "Webp Info",
    "href": "https://developers.google.com/speed/webp/"
  }, {
    "name": "Webp Lossless Spec",
    "href": "https://developers.google.com/speed/webp/docs/webp_lossless_bitstream_specification"
  }]
}
!*/
/* DOC
Tests for non-alpha lossless webp support.
*/
import Modernizr, { addTest, createAsyncTestListener } from "../../src/Modernizr.js";

Modernizr.addAsyncTest(function() {
  var image = new Image();

  image.onerror = function() {
    addTest('webplossless', false, {aliases: ['webp-lossless']});
  };

  image.onload = function() {
    addTest('webplossless', image.width === 1, {aliases: ['webp-lossless']});
  };

  image.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
});

export default createAsyncTestListener("webplossless");
