/*!
{
  "name": "canvas.toDataURL type support",
  "property": ["todataurljpeg", "todataurlpng", "todataurlwebp"],
  "tags": ["canvas"],
  "async" : false,
  "notes": [{
    "name": "HTML5 Spec",
    "href": "http://www.w3.org/TR/html5/the-canvas-element.html#dom-canvas-todataurl"
  }]
}
!*/
define(['Modernizr', 'addTest', 'createElement', 'test/canvas'], function( Modernizr, addTest, createElement ) {

  if (!Modernizr.canvas) {
    return false;
  }

  var canvas = createElement('canvas');

  addTest('todataurljpeg', function() {
    return canvas.toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0;
  });
  addTest('todataurlpng', function() {
    return canvas.toDataURL('image/png').indexOf('data:image/png') === 0;
  });
  addTest('todataurlwebp', function() {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  });

  canvas = undefined;

});
