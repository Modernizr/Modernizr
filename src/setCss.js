define(function() {
  /**
   * setCss applies given styles to the DOM node.
   */
  function setCss( node, str ) {
    try {
      node.style.cssText = str;
    }
    catch(e) {// Content Security Policy restrictions workaround
      node.setAttribute('style', str);
    }
  }

  return setCss;
});
