import isBrowser from './isBrowser.js';

/**
 * docElement is a convenience wrapper to grab the root element of the document
 *
 * @access private
 * @returns {HTMLElement|SVGElement} The root element of the document
 */
var docElement = isBrowser && document.documentElement;
export default docElement;
