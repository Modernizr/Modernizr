Modernizr.addTest('fullscreen',function() {
     for(var i = 0, len = Modernizr._domPrefixes.length, pfx; i < len; i++) {
          pfx = Modernizr._domPrefixes[i].toLowerCase();
          if(document[pfx + 'CancelFullScreen'] || document[pfx + 'ExitFullscreen']) {
               return true;
          }
     }
     return !!document['exitFullscreen'] || false;
});

// http://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/ControllingMediaWithJavaScript/ControllingMediaWithJavaScript.html#//apple_ref/doc/uid/TP40009523-CH3-SW20
// https://developer.mozilla.org/en/API/Fullscreen
