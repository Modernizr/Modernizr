define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  /*
  https://developer.mozilla.org/en/CSS/background-position
  http://www.w3.org/TR/css3-background/#background-position

  Example: http://jsfiddle.net/Blink/bBXvt/
  */

  Modernizr.addTest('bgpositionshorthand', function() {
    var elem = createElement('a');
    var eStyle = elem.style;
    var val = 'right 10px bottom 10px';
    eStyle.cssText = 'background-position: ' + val + ';';
    return (eStyle.backgroundPosition === val);
  });
});
