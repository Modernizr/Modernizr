/*!
{
  "name": "canvas blending support",
  "property": "canvasblending",
  "caniuse": "canvas-blending",
  "tags": ["canvas"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://drafts.fxtf.org/compositing-1/"
  }, {
    "name": "Article",
    "href": "https://web.archive.org/web/20171003232921/http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/"
  }]
}
!*/
/* DOC
Detects if Photoshop style blending modes are available in canvas.
*/
define(['Modernizr', 'createElement', 'test/canvas'], function(Modernizr, createElement) {
  Modernizr.addTest('canvasblending', function() {
    if (Modernizr.canvas === false) {
      return false;
    }
    var ctx = createElement('canvas').getContext('2d');
    // firefox 3 throws an error when setting an invalid `globalCompositeOperation`
    try {
      ctx.globalCompositeOperation = 'screen';
    } catch (e) {}

    return ctx.globalCompositeOperation === 'screen';
  });
});
