/*!
{
  "name": "canvas winding support",
  "property": "canvaswinding",
  "tags": ["canvas"],
  "notes": [{
    "name": "Article",
    "href": "https://web.archive.org/web/20170825024655/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/"
  }]
}
!*/
/* DOC
Determines if winding rules, which controls if a path can go clockwise or counterclockwise
*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';
import '../canvas.js';

Modernizr.addTest('canvaswinding', function() {
  if (Modernizr.canvas === false) {
    return false;
  }
  var ctx = createElement('canvas').getContext('2d');

  ctx.rect(0, 0, 10, 10);
  ctx.rect(2, 2, 6, 6);
  return ctx.isPointInPath(5, 5, 'evenodd') === false;
});

export default Modernizr.canvaswinding;
