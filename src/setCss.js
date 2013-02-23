define(['Modernizr', 'mStyle'], function( Modernizr, mStyle ) {
  /**
   * setCss applies given styles to the Modernizr DOM node.
   */
  function setCss( str ) {
    mStyle.style.cssText = str;
  }

  // Clean up used to happen, but probably isn't
  // necessary since we delete the element
  /*Modernizr._q.unshift(function(){
    setCss('');
  });*/

  return setCss;
});
