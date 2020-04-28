import docElement from './docElement.js';
import isBrowser from './isBrowser.js';
/**
 * A convenience helper to check if the document we are running in is an SVG document
 *
 * @access private
 * @returns {boolean}
 */
var isSVG = isBrowser && docElement.nodeName.toLowerCase() === 'svg';

export default isSVG;
