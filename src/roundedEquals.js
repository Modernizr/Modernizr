define(function() {
  /**
   * roundedEquals takes two integers and checks if the first is within 1 of the second
   *
   * @access private
   * @function roundedEquals
   * @param {number} a - first integer
   * @param {number} b - second integer
   * @returns {boolean} true if the first integer is within 1 of the second, false otherwise
   */
  function roundedEquals(a, b) {
    return a - 1 === b || a === b || a + 1 === b;
  }

  return roundedEquals;
});
