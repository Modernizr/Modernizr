/*!
{
  "name": "WebGL",
  "property": "webgl",
  "caniuse": "webgl",
  "tags": ["webgl", "graphics"],
  "polyfills": [{
    "name": "jebgl",
    "href": "http://code.google.com/p/jebgl/"
  },{
    "name": "webgl-compat",
    "href": "https://github.com/sinisterchipmunk/webgl-compat"
  },{
    "name": "cwebgl",
    "href": "http://code.google.com/p/cwebgl/"
  },{
    "name": "IEWebGL",
    "href": "http://iewebgl.com/"
  }]
}
!*/
define(['Modernizr'], function( Modernizr ) {
  // webk.it/70117 is tracking a legit WebGL feature detect proposal
  Modernizr.addTest('webgl', !!window.WebGLRenderingContext);
});
