define(['Modernizr', 'addTest', 'createElement', 'test/canvas'], function( Modernizr, addTest, createElement ) {
  // canvas.toDataURL type support
  // http://www.w3.org/TR/html5/the-canvas-element.html#dom-canvas-todataurl

  // This is an async test
  Modernizr.addAsyncTest(function () {
    // This test is asynchronous. Watch out.
    if (!Modernizr.canvas) {
      Modernizr._addTest('todataurljpeg', false, ['todataurlwebp']);
      return false;
    }

    var image = new Image(),
    canvas = createElement('canvas'),
    ctx = canvas.getContext('2d');

    image.onload = function() {
      ctx.drawImage(image, 0, 0);

      addTest('todataurljpeg', function() {
        return canvas.toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0;
      });
      addTest('todataurlwebp', function() {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      });
    };

    image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
  });
});
