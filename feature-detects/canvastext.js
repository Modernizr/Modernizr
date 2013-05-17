define(['Modernizr', 'createElement', 'test/canvas'], function( Modernizr, createElement ) {
  Modernizr.addTest('canvastext',  function() {
    if (Modernizr.canvas  === false) return false;
    return typeof createElement('canvas').getContext('2d').fillText == 'function';
  });
});
