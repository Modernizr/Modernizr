/*!
{
  "name": "canvas winding support",
  "property": ["canvaswinding"],
  "tags": ["canvas"],
  "async" : false,
  "notes": [{
    "name": "Article",
    "href": "http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/"
  }]
}
!*/
/* DOC
Determines if a winding rule (e.g. `evenodd`) can be specified for a path, which controls how it is determined if a point falls within the path.
*/
define(['Modernizr', 'createElement', 'test/canvas'], function( Modernizr, createElement ) {

  Modernizr.addTest('canvaswinding', function() {
    if (Modernizr.canvas === false) return false;
    var ctx = createElement('canvas').getContext('2d');

    ctx.rect(0, 0, 10, 10);
    ctx.rect(2, 2, 6, 6);
    return ctx.isPointInPath(5, 5, 'evenodd') === false;
  });

});
