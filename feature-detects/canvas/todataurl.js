/*!
{
  "name": "canvas.toDataURL type support",
  "property": ["todataurljpeg", "todataurlpng", "todataurlwebp"],
  "tags": ["canvas"],
  "builderAliases": ["canvas_todataurl_type"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement.toDataURL"
  }]
}
!*/
define(['Modernizr', 'createElement', 'test/canvas'], function(Modernizr, createElement) {

  var canvas = createElement('canvas');

  Modernizr.addTest('todataurljpeg', function() {
    var supports = false;

    // AVG secure browser with 'Anti-Fingerprinting' turned on throws an exception when using an "invalid" toDataUrl
    try {
      supports = !!Modernizr.canvas && canvas.toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0;
    } catch (e) {}

    return supports;
  });
  Modernizr.addTest('todataurlpng', function() {
    var supports = false;

    // AVG secure browser with 'Anti-Fingerprinting' turned on throws an exception when using an "invalid" toDataUrl
    try {
      supports = !!Modernizr.canvas && canvas.toDataURL('image/png').indexOf('data:image/png') === 0;
    } catch (e) {}

    return supports;
  });
  Modernizr.addTest('todataurlwebp', function() {
    var supports = false;

    // firefox 3 throws an error when you use an "invalid" toDataUrl
    try {
      supports = !!Modernizr.canvas && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch (e) {}

    return supports;
  });

});
