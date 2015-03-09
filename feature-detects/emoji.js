/*!
{
  "name": "Emoji",
  "property": "emoji"
}
!*/
/* DOC
Detects support for emoji character sets.
*/
define(['Modernizr', 'createElement', 'test/canvastext'], function( Modernizr, createElement ) {
  Modernizr.addTest('emoji', function() {
    if (!Modernizr.canvastext || !window.devicePixelRatio) return false;
    var node = createElement('canvas'),
    ctx = node.getContext('2d'),
    startPointX = 8 * window.devicePixelRatio,
    startPointY = 8 * window.devicePixelRatio;
    
    ctx.fillStyle = '#f00';
    ctx.textBaseline = 'top';
    ctx.font = '32px Arial';
    ctx.fillText('\ud83d\udc28', 0, 0); // U+1F428 KOALA
    return ctx.getImageData(startPointX, startPointY, 1, 1).data[0] !== 0;
  });
});
