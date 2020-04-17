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
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('speechsynthesis', function() {
    try {
      return 'SpeechSynthesisUtterance' in window;
    } catch (e) {
      return false;
    }
  });
});
