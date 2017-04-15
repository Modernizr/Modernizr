// Feature detection test for the Speech Recognition JavaScript API
// http://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html
//
// by @alrra

Modernizr.addTest('speechrecognition', !!Modernizr.prefixed('SpeechRecognition', window));
