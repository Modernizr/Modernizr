define(['Modernizr', 'addTest'], function( Modernizr, addTest ) {
  // http://en.wikipedia.org/wiki/JPEG_XR
  // Supported in IE9+

  Modernizr.addAsyncTest(function() {
    var image = new Image();

    image.onload = image.onerror = function() {
      addTest('jpegxr', image.width == 1, { aliases: ['jpeg-xr'] });
    };

    // The smallest JXR I could generate using the reference encoder (where pixel.tif is a 1x1 black image)
    // ./jpegxr pixel.tif -c -o pixel.jxr -f YOnly -q 255 -b DCONLY -a 0 -w
    image.src = 'data:image/vnd.ms-photo;base64,SUm8AQgAAAAFAAG8AQAQAAAASgAAAIC8BAABAAAAAQAAAIG8BAABAAAAAQAAAMC8BAABAAAAWgAAAMG8BAABAAAAHwAAAAAAAAAkw91vA07+S7GFPXd2jckNV01QSE9UTwAZAYBxAAAAABP/gAAEb/8AAQAAAQAAAA==';
  });
});
