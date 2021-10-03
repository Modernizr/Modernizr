define(function() {
  /**
   * domToCSS takes a camelCase string and converts it to hyphen-case
   * e.g. boxSizing -> box-sizing
   *
   * @access private
   * @function domToCSS
   * @param {string} name - String name of camelCase prop we want to convert
   * @returns {string} The hyphen-case version of the supplied name
   */
  const domToCSS =  name => {
    return name.replace(/([A-Z])/g, (str, m1)=> {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
  }

  return domToCSS;
});
