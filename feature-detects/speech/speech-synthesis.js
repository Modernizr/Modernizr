/*!
{
  "property": "speechsynthesis",
  "tags": ["input", "speech"],
  "authors": ["Cătălin Mariș"],
  "name": "Speech Synthesis API",
  "notes": [{
    "name": "W3C Web Speech API Specification - The SpeechSynthesis Interface",
    "href": "https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section"
  }]
}
!*/

define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('speechsynthesis', 'SpeechSynthesisUtterance' in window);
});
