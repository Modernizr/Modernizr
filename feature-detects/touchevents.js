/*!
{
  "name": "Touch Events",
  "property": "touchevents",
  "caniuse": "touch",
  "tags": ["media", "attribute"],
  "notes": [{
    "name": "Touch Events spec",
    "href": "https://www.w3.org/TR/2013/WD-touch-events-20130124/"
  }],
  "warnings": [
    "** DEPRECATED see https://github.com/Modernizr/Modernizr/pull/2432 **",
    "Indicates if the browser supports the Touch Events spec, and does not necessarily reflect a touchscreen device"
  ],
  "knownBugs": [
    "False-positive on some configurations of Nokia N900",
    "False-positive on some BlackBerry 6.0 builds – https://github.com/Modernizr/Modernizr/issues/372#issuecomment-3112695"
  ]
}
!*/
/* DOC
Indicates if the browser supports the W3C Touch Events API.

This *does not* necessarily reflect a touchscreen device:

* Older touchscreen devices only emulate mouse events
* Modern IE touch devices implement the Pointer Events API instead: use `Modernizr.pointerevents` to detect support for that
* Some browsers & OS setups may enable touch APIs when no touchscreen is connected
* Future browsers may implement other event models for touch interactions

See this article: [You Can't Detect A Touchscreen](http://www.stucox.com/blog/you-cant-detect-a-touchscreen/).

It's recommended to bind both mouse and touch/pointer events simultaneously – see [this HTML5 Rocks tutorial](https://www.html5rocks.com/en/mobile/touchandmouse/).

This test will also return `true` for Firefox 4 Multitouch support.
*/
define(['Modernizr', 'prefixes', 'mq'], function(Modernizr, prefixes, mq) {
  // Chrome (desktop) used to lie about its support on this, but that has since been rectified: https://bugs.chromium.org/p/chromium/issues/detail?id=36415
  // Chrome also changed its behaviour since v70 and recommends the TouchEvent object for detection: https://www.chromestatus.com/feature/4764225348042752
  Modernizr.addTest('touchevents', function() {
    if (('ontouchstart' in window) || window.TouchEvent || window.DocumentTouch && document instanceof DocumentTouch) {
      return true;
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://github.com/Modernizr/Modernizr/issues/1814
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
  });
});
