/*!
{
  "name": "HTML5 Audio Element",
  "property": "audio",
  "caniuse": "audio",
  "tags": ["html5", "audio", "media"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements"
  }]
}
!*/
/* DOC
Detects support of the audio element, as well as testing what types of content it supports.

Subproperties are provided to describe support for `ogg`, `mp3`,`opus`, `wav` and `m4a` formats, e.g.:

```javascript
Modernizr.audio         // true
Modernizr.audio.ogg     // 'probably'
```
*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
  //                     thx to NielsLeenheer and zcorpan

  // Note: in some older browsers, "no" was a return value instead of empty string.
  //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
  //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5
  (function() {
    var elem = createElement('audio');

    Modernizr.addTest('audio', function() {
      var bool = false;
      try {
        bool = !!elem.canPlayType;
        if (bool) {
          bool = new Boolean(bool);
        }
      } catch (e) {}

      return bool;
    });

    // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
    try {
      if (!!elem.canPlayType) {
        Modernizr.addTest('audio.ogg', elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''));
        Modernizr.addTest('audio.mp3', elem.canPlayType('audio/mpeg; codecs="mp3"').replace(/^no$/, ''));
        Modernizr.addTest('audio.opus', elem.canPlayType('audio/ogg; codecs="opus"') ||
          elem.canPlayType('audio/webm; codecs="opus"').replace(/^no$/, ''));
        Modernizr.addTest('audio.wav', elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''));
        Modernizr.addTest('audio.m4a', (elem.canPlayType('audio/x-m4a;') ||
          elem.canPlayType('audio/aac;')).replace(/^no$/, ''));
      }
    } catch (e) {}
  })();
});
