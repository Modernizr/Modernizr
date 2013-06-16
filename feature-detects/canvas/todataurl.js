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
define(['Modernizr', 'createElement', 'test/canvas'], function( Modernizr, createElement ) {

  var canvas = createElement('canvas');
  var testSupport = function(format) {
    return !!Modernizr.canvas && canvas.toDataURL('image/' + format).indexOf('data:image/' + format) === 0; 
  }

  var supportsjpeg = testSupport('jpeg');
  var supportspng  = testSupport('png');
  var supportswebp = testSupport('webp');

  Modernizr.addTest('todataurl', function() {
    return (supportsjpeg || supportspng || supportswebp);
  });

  Modernizr.addTest('todataurljpeg', function() {
    return supportsjpeg;
  });
  Modernizr.addTest('todataurlpng', function() {
    return supportspng;
  });
  Modernizr.addTest('todataurlwebp', function() {
    return supportswebp;
  });

});
