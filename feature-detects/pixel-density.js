// Device Pixel Density
// High res devices should have devicePixelRatio and a pixel density around 2, otherwise assume low res
// http://www.robertprice.co.uk/robblog/archive/2011/5/Detecting_Retina_Displays_From_JavaScript_And_CSS.shtml
// http://bradbirdsall.com/mobile-web-in-high-resolution
// by @matthewlein

Modernizr.addTest('highres', function() {

  // for opera
  var ratio = '2.99/2';
  // for webkit
  var num = '1.499';
  var mqs = [
      'only screen and (-o-min-device-pixel-ratio:' + ratio + ')',
      'only screen and (min--moz-device-pixel-ratio:' + ratio + ')',
      'only screen and (-webkit-min-device-pixel-ratio:' + num + ')',
      'only screen and (min-device-pixel-ratio:' + num + ')'
  ];
  var isHighRes = false;

  // loop through vendors, checking non-prefixed first
  for (var i = mqs.length - 1; i >= 0; i--) {
      isHighRes = Modernizr.mq( mqs[i] );
      // if found one, return early
      if ( isHighRes ) {
          return isHighRes;
      }
  }
  // not highres
  return isHighRes;

});