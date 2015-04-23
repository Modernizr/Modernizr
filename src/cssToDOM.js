define(function() {
  // Helper function for converting kebab-case to camelCase,
  // e.g. box-sizing -> boxSizing
  function cssToDOM(name) {
    return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
      return m1 + m2.toUpperCase();
    }).replace(/^-/, '');
  }
  return cssToDOM;
});
