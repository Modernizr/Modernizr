/*!
{
  "name": "WebGL",
  "property": "webgl",
  "caniuse": "webgl",
  "tags": ["webgl", "graphics"],
  "polyfills": ["jebgl", "webglcompat", "cwebgl", "iewebgl"]
}
!*/
define(['Modernizr'], function( Modernizr ) {
  // webk.it/70117 is tracking a legit WebGL feature detect proposal
  Modernizr.addTest('webgl', 'WebGLRenderingContext' in window);
});
