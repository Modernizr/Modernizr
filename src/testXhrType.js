define(function() {
  /**
   * https://mathiasbynens.be/notes/xhr-responsetype-json#comment-4
   *
   * @author Mathias Bynens
   * @access private
   * @function testXhrType
   * @param {string} type - String name of the XHR type you want to detect
   * @returns {boolean} true if the responseType is of the specified type
   */
  var testXhrType = function(type) {
    if (typeof XMLHttpRequest === 'undefined') {
      return false;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/', true);
    try {
      xhr.responseType = type;
    } catch (error) {
      return false;
    }
    return 'response' in xhr && xhr.responseType === type;
  };

  return testXhrType;
});
