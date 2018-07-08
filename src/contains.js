define(function() {
  /**
   * contains checks to see if a string contains another string
   *
   * @access private
   * @function contains
   * @param {string} str - The string we want to check for substrings
   * @param {string} substr - The substring we want to search the first string for
   * @returns {boolean} true if a string contains another string
   */
  function contains(str, substr) {
    return !!~('' + str).indexOf(substr);
  }

  return contains;
});
