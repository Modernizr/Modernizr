
// Canvas winding rules

// depends on canvas test.

Modernizr.addTest('canvaswinding', function () {
    if (Modernizr.canvas === false) return false;
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.rect(0, 0, 10, 10);
    ctx.rect(2, 2, 6, 6);
    return ctx.isPointInPath(5, 5, 'evenodd') == false;
});
