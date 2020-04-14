/*!
{
  "property": "speechsynthesis",
  "caniuse": "speech-synthesis",
  "tags": ["input", "speech"],
  "authors": ["Cătălin Mariș"],
  "name": "Speech Synthesis API",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://w3c.github.io/speech-api/speechapi.html#tts-section"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('speechsynthesis', function() {
  try {
    return 'SpeechSynthesisUtterance' in _globalThis;
  } catch (e) {
    return false;
  }
});

export default Modernizr.speechsynthesis
