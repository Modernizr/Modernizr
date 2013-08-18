/*!
{
  "async": false,
  "authors": ["Cătălin Mariș"],
  "name": "Speech Recognition API",
  "notes": [
    {
      "name": "W3C Web Speech API Specification",
      "href": "http://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html"
    },
    {
      "name": "Introduction to the Web Speech API",
      "href": "http://updates.html5rocks.com/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API"
    }
  ],
  "property": "speechrecognition",
  "tags": ["input", "speech"]
}
!*/

define(['Modernizr', 'prefixed'], function (Modernizr, prefixed) {
  Modernizr.addTest('speechrecognition', !!prefixed('SpeechRecognition', window));
});
