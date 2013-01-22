define(['Modernizr', 'testStyles'], function( Modernizr, testStyles ) {
  // developer.mozilla.org/en/CSS/background-repeat

  // test page: jsbin.com/uzesun/
  // http://jsfiddle.net/ryanseddon/yMLTQ/6/

  function getBgRepeatValue( elem ) {
    return (window.getComputedStyle ?
            getComputedStyle(elem, null).getPropertyValue('background') :
            elem.currentStyle['background']);
  }

  testStyles(' #modernizr { background-repeat: round; } ', function( elem, rule ) {
    Modernizr.addTest('bgrepeatround', getBgRepeatValue(elem) == 'round');
  });

  testStyles(' #modernizr { background-repeat: space; } ', function( elem, rule ) {
    Modernizr.addTest('bgrepeatspace', getBgRepeatValue(elem) == 'space');
  });

});
