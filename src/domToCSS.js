define(function() {
  // Helper function for converting camelCase to kebab-case,
  // e.g. boxSizing -> box-sizing
  function domToCSS(name) {
    return name.replace(/([A-Z])/g, function(str, m1) {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
  }
  return domToCSS;
});
