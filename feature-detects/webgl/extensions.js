define(['Modernizr', 'createElement', 'test/webgl'], function( Modernizr, createElement ) {
  // Grab the WebGL extensions currently supported and add to the Modernizr.webgl object
  // spec: www.khronos.org/registry/webgl/specs/latest/#5.13.14

  // based on code from ilmari heikkinen
  // code.google.com/p/graphics-detect/source/browse/js/detect.js

  // Not Async but handles it's own self
  Modernizr.addAsyncTest(function() {

    // Not a good candidate for css classes, so we avoid addTest stuff
    Modernizr.webglextensions = new Boolean(false);

    if (!Modernizr.webgl) {
      return;
    }

    var canvas;
    var ctx;
    var exts;

    try {
      canvas = createElement('canvas');
      ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      exts = ctx.getSupportedExtensions();
    }
    catch (e) {
      return;
    }

    if (ctx !== undefined) {
      Modernizr.webglextensions = new Boolean(true);
    }

    for (var i = -1, len = exts.length; ++i < len; ){
      Modernizr.webglextensions[exts[i]] = true;
    }

    canvas = undefined;
  });
});
