define(function() {
  /**
   * cssToDOM takes a hyphen-case string and converts it to camelCase
   * e.g. box-sizing -> boxSizing
   *
   * @access private
   * @function cssToDOM
   * @param {string} name - String name of hyphen-case prop we want to convert
   * @returns {string} The camelCase version of the supplied name
   */
  function cssToDOM(name) {
    return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
      return m1 + m2.toUpperCase();
    }).replace(/^-/, '');
  }

  return cssToDOM;
});
