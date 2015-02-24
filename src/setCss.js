define(['Modernizr', 'mStyle'], function( Modernizr, mStyle ) {
  /**
   * setCss applies given styles to the Modernizr DOM node.
   */
  function setCss( str ) {
    mStyle.style.cssText = str;
  }


  return setCss;
});
