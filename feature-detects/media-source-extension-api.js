/*!
{
  "name": "Media Source Extensions API",
  "caniuse": "mediasource",
  "property": "mediasource",
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API"
  }],
  "builderAliases": ["media_source_extension_api"]
}
!*/
/* DOC
Detects support the Media Source Extensions API, which allows JavaScript to send byte streams to media codecs within web browsers that support HTML5 video.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('mediasource', 'MediaSource' in window);
});
