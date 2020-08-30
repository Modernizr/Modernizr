/*!
{
  "name": "HTML5 Video",
  "property": "video",
  "caniuse": "video",
  "tags": ["html5", "video", "media"],
  "knownBugs": ["Without QuickTime, `Modernizr.video.h264` will be `undefined`; https://github.com/Modernizr/Modernizr/issues/546"],
  "polyfills": [
    "html5media",
    "mediaelementjs",
    "videojs",
    "leanbackplayer",
    "videoforeverybody"
  ]
}
!*/
/* DOC
Detects support for the video element, as well as testing what types of content it supports.

Subproperties are provided to describe support for `ogg`, `h264`, `h265`, `webm`, `vp9`, `hls` and `av1` formats, e.g.:

```javascript
Modernizr.video         // true
Modernizr.video.ogg     // 'probably'
```
*/
import Modernizr from '../src/Modernizr.js';
import createElement from '../src/createElement.js';
var result = false;
// Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
//                     thx to NielsLeenheer and zcorpan

// Note: in some older browsers, "no" was a return value instead of empty string.
//   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
//   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5
(function() {
  var elem = createElement('video');
  var bool = false;

  Modernizr.addTest('video', function() {
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
    if (bool) {
       var ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '');
       var h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');
       var h265 = elem.canPlayType('video/mp4; codecs="hev1"').replace(/^no$/, '');
       var webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '');
       var vp9 = elem.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, '');
       var hls = elem.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, '');
       var av1 = elem.canPlayType('video/mp4; codecs="av01"').replace(/^no$/, '');

      result = {
        "ogg": ogg,
        "h264": h264,
        "h265": h265,
        "webm": webm,
        "vp9": vp9,
        "hls": hls,
        "av1": av1,
      }

      Modernizr.addTest('video.ogg', ogg);

      // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
      Modernizr.addTest('video.h264', h264);
      Modernizr.addTest('video.webm', webm);
      Modernizr.addTest('video.vp9', vp9);
      Modernizr.addTest('video.hls', hls);
    }
  } catch (e) {}
})();

export default result
