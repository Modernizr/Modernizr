/*!
{
  "name": "canvas.toDataURL type support",
  "property": ["todataurljpeg", "todataurlpng", "todataurlwebp"],
  "tags": ["canvas"],
  "builderAliases": ["canvas_todataurl_type"],
  "async" : false,
  "notes": [{
    "name": "HTML5 Spec",
    "href": "http://www.w3.org/TR/html5/the-canvas-element.html#dom-canvas-todataurl"
  }]
}
!*/
/* DOC
Detects whether the `.toDataURL` method is supported for creating image data as a Data URI from a canva graphics:

```javascript
Modernizr.todataurljpeg     // canvas can be rendered as a JPEG
Modernizr.todataurlpng      // canvas can be rendered as a PNG
Modernizr.todataurlwebp     // canvas can be rendered as a WebP
```
*/
define(['Modernizr', 'createElement', 'test/canvas'], function( Modernizr, createElement ) {

  var canvas = createElement('canvas');

  Modernizr.addTest('todataurljpeg', function() {
    return !!Modernizr.canvas && canvas.toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0;
  });
  Modernizr.addTest('todataurlpng', function() {
    return !!Modernizr.canvas && canvas.toDataURL('image/png').indexOf('data:image/png') === 0;
  });
  Modernizr.addTest('todataurlwebp', function() {
    return !!Modernizr.canvas && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  });

});
