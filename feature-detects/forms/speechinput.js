/*!
{
  "name": "Speech Input API",
  "property": "speechinput",
  "tags": ["forms", "speech", "attribute"],
  "authors": ["Cătălin Mariș"],
  "knownBugs": [
    "This detect only checks the webkit version because the Speech Input API was only implemented in Chrome and it was deprecated in favor of the Web Speech API."
  ],
  "notes": [{
    "name": "W3C Speech Input API Specification",
    "href": "http://lists.w3.org/Archives/Public/public-xg-htmlspeech/2011Feb/att-0020/api-draft.html"
  }],
  "warnings": [
    "Do not use the Speech Input API as it was deprecated in favor of the Web Speech API.",
    "Only Chrome ever implemented this API, and they are planning to deprecate and remove the related code: https://code.google.com/p/chromium/issues/detail?id=223198."
  ]
}
!*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {

  // `webkitSpeech` in elem doesn`t work correctly in all versions of Chromium based browsers.
  // It can return false even if they have support for speech i.imgur.com/2Y40n.png
  // Testing with 'onwebkitspeechchange' seems to fix this problem.

  Modernizr.addTest('speechinput', function() {
    var elem = createElement('input');
    return 'speech' in elem || 'onwebkitspeechchange' in elem;
  });
});
