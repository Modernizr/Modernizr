import Modernizr from 'Modernizr';
import createElement from 'createElement';
/**
 * Create our "modernizr" element that we do most feature tests on.
 *
 * @access private
 */

var modElem = {
  elem: createElement('modernizr')
};

// Clean up this element
Modernizr._q.push(function() {
  delete modElem.elem;
});

export default modElem;
