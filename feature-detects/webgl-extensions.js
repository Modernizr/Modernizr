

// Grab the WebGL extensions currently supported and add to the Modernizr.webgl object
// spec: www.khronos.org/registry/webgl/specs/latest/#5.13.14

// based on code from ilmari heikkinen
// code.google.com/p/graphics-detect/source/browse/js/detect.js


(function(){

    if (!Modernizr.webgl) return;

    var canvas, ctx, exts;

    try { 
        canvas  = document.createElement('canvas'),
        ctx     = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        exts    = ctx.getSupportedExtensions();
    }
    catch (e) {
        return;
    }

    Modernizr.webgl = new Boolean(true);

    for (var i = -1, len = exts.length; ++i < len; ){
        Modernizr.webgl[exts[i]] = true;    
    }

    canvas = undefined;;
})();