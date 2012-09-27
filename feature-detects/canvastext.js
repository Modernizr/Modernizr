
// Canvas text

// depends on canvas test.

Modernizr.addTest('canvastext', function(){
  if (Modernizr.canvas  === false) return false;
  return typeof document.createElement('canvas').getContext('2d').fillText == 'function';
});
