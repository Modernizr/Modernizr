import {ModernizrProto} from './Modernizr.js';
import createElement from './createElement.js';
/**
 * Create our "modernizr" element that we do most feature tests on.
 *
 * @access private
 */
var modElem = {
  elem: createElement('modernizr')
};

// Clean up this element
ModernizrProto._q.push(function() {
  delete modElem.elem;
});

export default modElem;
