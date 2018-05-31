/*!
{
  "name": "WebGL",
  "property": "webgl",
  "caniuse": "webgl",
  "tags": ["webgl", "graphics"],
  "polyfills": ["jebgl", "cwebgl", "iewebgl"]
}
!*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('webgl', function() {
    return 'WebGLRenderingContext' in window;
  });
});
