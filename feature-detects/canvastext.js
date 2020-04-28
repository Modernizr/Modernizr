/*!
{
  "name": "Canvas text",
  "property": "canvastext",
  "caniuse": "canvas-text",
  "tags": ["canvas", "graphics"],
  "polyfills": ["canvastext"]
}
!*/
/* DOC
Detects support for the text APIs for `<canvas>` elements.
*/
import Modernizr from '../src/Modernizr.js';
import createElement from '../src/createElement.js';
import './canvas.js';

Modernizr.addTest('canvastext', function() {
  if (Modernizr.canvas === false) {
    return false;
  }
  return typeof createElement('canvas').getContext('2d').fillText === 'function';
});

export default Modernizr.canvastext;
