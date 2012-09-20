
// Canvas text

Modernizr.addTest('canvastext',
  (Modernizr.canvastext = !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function')))
);
