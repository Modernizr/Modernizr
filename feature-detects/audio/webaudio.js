/*!
{
  "name": "Web Audio API",
  "property": "webaudio",
  "caniuse": "audio-api",
  "polyfills": ["dynamicaudiojs", "audiolibjs"],
  "tags": ["audio", "media"],
  "builderAliases": ["audio_webaudio_api"],
  "authors": ["Addy Osmani"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://webaudio.github.io/web-audio-api/"
  }]
}
!*/
/* DOC
Check for the Web Audio API
*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('webaudio', function() {
  var prefixed = 'webkitAudioContext' in _globalThis;
  var unprefixed = 'AudioContext' in _globalThis;

  if (Modernizr._config.usePrefixes) {
    return prefixed || unprefixed;
  }
  return unprefixed;
});

export default Modernizr.webaudio;
