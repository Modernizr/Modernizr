/*!
{
  "name": "WebGL",
  "property": "webgl",
  "caniuse": "webgl",
  "tags": ["webgl", "graphics"]
}
!*/
define(['Modernizr'], function( Modernizr ) {
  // webk.it/70117 is tracking a legit WebGL feature detect proposal
  Modernizr.addTest('webgl', !!window.WebGLRenderingContext);
});
