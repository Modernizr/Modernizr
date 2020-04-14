/*!
{
  "property": "speechrecognition",
  "caniuse": "speech-recognition",
  "tags": ["input", "speech"],
  "authors": ["Cătălin Mariș"],
  "name": "Speech Recognition API",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://w3c.github.io/speech-api/speechapi.html#speechreco-section"
  }, {
    "name": "Introduction to the Web Speech API",
    "href": "https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API"
  }]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import prefixed from '../../src/prefixed.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('speechrecognition', function() {
  try {
    return !!prefixed('SpeechRecognition', _globalThis);
  } catch (e) {
    return false;
  }
});

export default Modernizr.speechrecognition
