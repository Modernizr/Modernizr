define(['Modernizr', 'domPrefixes', 'prefixed'], function( Modernizr, domPrefixes, prefixed ) {
  // http://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/ControllingMediaWithJavaScript/ControllingMediaWithJavaScript.html#//apple_ref/doc/uid/TP40009523-CH3-SW20
  // https://developer.mozilla.org/en/API/Fullscreen
  // github.com/Modernizr/Modernizr/issues/739
  Modernizr.addTest('fullscreen', !!(prefixed("exitFullscreen", document, false) || prefixed("cancelFullScreen", document, false)));
});
