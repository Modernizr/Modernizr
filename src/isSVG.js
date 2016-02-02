import docElement from 'docElement';
/**
 * A convenience helper to check if the document we are running in is an SVG document
 *
 * @access private
 * @returns {boolean}
 */

var isSVG = docElement.nodeName.toLowerCase() === 'svg';
export default isSVG;
