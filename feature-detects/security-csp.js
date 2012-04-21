/**
 * Content Security Policy (CSP)
 * https://developer.mozilla.org/en/Introducing_Content_Security_Policy
 */
Modernizr.addTest('csp', function() {
  return !(function() {
    try {
      return eval('true');
    } catch (e) {}
  })();
});
