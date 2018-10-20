/*!
{
  "property": "speechrecognition",
  "tags": ["input", "speech"],
  "authors": ["Cătălin Mariș"],
  "name": "Speech Recognition API",
  "notes": [{
      "name": "W3C Spec",
      "href": "https://w3c.github.io/speech-api/speechapi.html#speechreco-section"
    },{
      "name": "Introduction to the Web Speech API",
      "href": "https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API"
  }]
}
!*/
define(['Modernizr', 'prefixed'], function(Modernizr, prefixed) {
  Modernizr.addTest('speechrecognition', !!prefixed('SpeechRecognition', window));
});
