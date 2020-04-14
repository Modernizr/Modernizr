import domToCSS from './domToCSS.js';
import _globalThis from './globalThis.js';
/**
 * nativeTestProps allows for us to use native feature detection functionality if available.
 * some prefixed form, or false, in the case of an unsupported rule
 *
 * @access private
 * @function nativeTestProps
 * @param {Array} props - An array of property names
 * @param {string} value - A string representing the value we want to check via @supports
 * @returns {boolean|undefined} A boolean when @supports exists, undefined otherwise
 */
// Accepts a list of property names and a single value
// Returns `undefined` if native detection not available
function nativeTestProps(props, value) {
  var i = props.length;
  // Start with the JS API: https://www.w3.org/TR/css3-conditional/#the-css-interface
  if ('CSS' in _globalThis && 'supports' in _globalThis.CSS) {
    // Try every prefixed variant of the property
    while (i--) {
      if (_globalThis.CSS.supports(domToCSS(props[i]), value)) {
        return true;
      }
    }
    return false;
  }

  return undefined;
}
export default nativeTestProps;
