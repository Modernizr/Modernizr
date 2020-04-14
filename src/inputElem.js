import createElement from './createElement.js';
/**
 * since we have a fairly large number of input tests that don't mutate the input
 * we create a single element that can be shared with all of those tests for a
 * minor perf boost
 *
 * @access private
 * @returns {HTMLInputElement}
 */
var inputElem = createElement('input');
export default inputElem;
