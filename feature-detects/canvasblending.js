
// Canvas basic blending

// depends on canvas test.

Modernizr.addTest('canvasblending', function () {
    if (Modernizr.canvas === false) return false;
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.globalCompositeOperation = 'screen';
    return ctx.globalCompositeOperation == 'screen';
});
