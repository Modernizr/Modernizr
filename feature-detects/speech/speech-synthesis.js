/*!
{
  "property": "speechsynthesis",
  "tags": ["input", "speech"],
  "authors": ["Cătălin Mariș"],
  "name": "Speech Synthesis API",
  "notes": [{
    "name": "W3C Web Speech API Specification - The SpeechSynthesis Interface",
    "href": "https://w3c.github.io/speech-api/speechapi.html#tts-section"
  }]
}
!*/

define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('speechsynthesis', 'SpeechSynthesisUtterance' in window);
});
