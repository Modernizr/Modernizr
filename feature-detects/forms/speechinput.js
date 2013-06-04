/*!
{
  "name": "Speech Input for inputs",
  "property": "speechinput",
  "tags": ["forms", "speech", "attribute"],
  "authors": ["@alrra"],
  "knownBugs": [
    "This detect only checks the webkit version because the speech attribute is likely to be deprecated in favor of a JavaScript API."
  ],
  "notes": [{
    "name": "Future (but unsupported) Spec",
    "href": "http://lists.w3.org/Archives/Public/public-webapps/2011OctDec/att-1696/speechapi.html"
  }]
}
!*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {

  // `webkitSpeech` in elem doesn`t work correctly in all versions of Chromium based browsers.
  // It can return false even if they have support for speech i.imgur.com/2Y40n.png
  // Testing with 'onwebkitspeechchange' seems to fix this problem.

  // FIXME: add support for detecting the new spec'd behavior

  Modernizr.addTest('speechinput', function() {
    var elem = createElement('input');
    return 'speech' in elem || 'onwebkitspeechchange' in elem;
  });
});
