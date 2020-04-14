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
import Modernizr from '../../src/Modernizr.js';

import createElement from '../../src/createElement.js';
import '../canvas.js';

var canvas = createElement('canvas');

var supports = function(type) {
  var result = false;
  // AVG secure browser with 'Anti-Fingerprinting' turned on throws an exception when using an "invalid" toDataUrl
  // firefox 3 throws an error when you use an "invalid" toDataUrl
  try {
    result = !!Modernizr.canvas && canvas.toDataURL('image/' + type).indexOf('data:image/' + type) === 0;
  } catch (e) {}

  return result;
}

Modernizr.addTest('todataurljpeg', supports('jpeg'));
Modernizr.addTest('todataurlpng', supports('png'));
Modernizr.addTest('todataurlwebp', supports('webp'));

export const todataurljpeg = Modernizr.todataurljpeg;
export const todataurlpng = Modernizr.todataurlpng;
export const todataurlwebp = Modernizr.todataurlwebp;
export default {
  todataurljpeg: Modernizr.todataurljpeg,
  todataurlpng: Modernizr.todataurlpng,
  todataurlwebp: Modernizr.todataurlwebp
}
