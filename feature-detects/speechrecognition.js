/*!
{
  "name": "Speech recognition",
  "property": "speechrecognition",
  "authors": ["Tal Ater (@TalAter)"],
  "knownBugs": [
    "This detect only checks the webkit version for now. Other versions will be added as they are released."
  ],
  "notes": [{
    "name": "W3C Web Speech API Specification",
    "href": "https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html"
  },{
    "name": "Introduction to the Web Speech API",
    "href": "http://updates.html5rocks.com/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API"
  }]
}
!*/
/* DOC

Detects support for SpeechRecognition via webkitSpeechRecognition

*/
define(['Modernizr'], function( Modernizr ) {

  Modernizr.addTest('speechrecognition', 'webkitSpeechRecognition' in window);
});
