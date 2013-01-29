define(['Modernizr', 'domPrefixes'], function( Modernizr, domPrefixes ) {
  // http://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/ControllingMediaWithJavaScript/ControllingMediaWithJavaScript.html#//apple_ref/doc/uid/TP40009523-CH3-SW20
  // https://developer.mozilla.org/en/API/Fullscreen
  // github.com/Modernizr/Modernizr/issues/739
  Modernizr.addTest('fullscreen', !!(Modernizr.prefixed("exitFullscreen", document, false) || Modernizr.prefixed("cancelFullScreen", document, false)));
});
