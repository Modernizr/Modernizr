/*!
{
  "name": "WebGL",
  "property": "webgl",
  "caniuse": "webgl",
  "tags": ["webgl", "graphics"],
  "polyfills": ["jebgl", "webglcompat", "cwebgl", "iewebgl"]
}
!*/
/* DOC
Detects support for WebGL, does a simple check that could false positive on some GPUs.
Otherwise uses the more accurate supportsContext method.
*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('webgl', function() {
    var canvas = createElement('canvas');
    if ('supportsContext' in canvas) {
      return canvas.supportsContext('webgl') || canvas.supportsContext('experimental-webgl');
    }
    return !!window.WebGLRenderingContext;
  });
});
