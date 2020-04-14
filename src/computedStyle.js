/**
 * wrapper around getComputedStyle, to fix issues with Firefox returning null when
 * called inside of a hidden iframe
 *
 * @access private
 * @function computedStyle
 * @param {HTMLElement|SVGElement} elem - The element we want to find the computed styles of
 * @param {string|null} [pseudo] - An optional pseudo element selector (e.g. :before), of null if none
 * @param {string} prop - A CSS property
 * @returns {CSSStyleDeclaration} the value of the specified CSS property
 */

import _globalThis from './globalThis.js';

function computedStyle(elem, pseudo, prop) {
  var result;

  if ('getComputedStyle' in _globalThis) {
    result = _globalThis.getComputedStyle(elem, pseudo);

    if (result !== null) {
      if (prop) {
        result = result.getPropertyValue(prop);
      }
    } else {
      if (_globalThis.console) {
        var method = _globalThis.console.error ? 'error' : 'log';
        _globalThis.console[method]('getComputedStyle returning null, its possible modernizr test results are inaccurate');
      }
    }
  } else {
    result = !pseudo && elem.currentStyle && elem.currentStyle[prop];
  }

  return result;
}

export default computedStyle;
