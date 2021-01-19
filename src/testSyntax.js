/**
 * wraps around `eval` o see if it throws an error.
 * this is useful to see if new javascript syntax is supported
 *
 * @access public
 * @function testSynax
 * @param {string} js - a string of javascript code
 * @returns {boolean} true if code executes without error, false if not
 */

function testSyntax(js) {
  var supported;

  try {
    // eslint-disable-next-line
    eval(js);
    supported = true
  } catch (e) { }

  return !!supported;
}

export default testSyntax
