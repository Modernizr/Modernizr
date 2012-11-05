define(['mStyle'], function( mStyle ) {
  /**
   * setCss applies given styles to the Modernizr DOM node.
   */
  function setCss( str ) {
    mStyle.cssText = str;
  }
  return setCss;
});
