/*!
{
  "name": "Touch Events",
  "property": "touchevents",
  "caniuse" : "touch",
  "tags": ["media", "attribute"],
  "notes": [{
      "name": "Touch Events spec",
      "href": "http://www.w3.org/TR/2013/WD-touch-events-20130124/"
    },
    {
      "name": "Touch Events test page",
      "href": "http://modernizr.github.com/Modernizr/touch.html"
    }
  ],
  "warnings": [
    "Indicates if the browser supports the Touch Events spec, which does not necessarily reflect a touchscreen device"
  ],
  "knownBugs": [
    "False-positive on some configurations of Nokia N900"
  ]
}
!*/
/* DOC

The `Modernizr.touch` test only indicates if the browser supports touch events, which does not necessarily reflect a touchscreen device, as evidenced by tablets running Windows 7 or, alas, the Palm Pre / WebOS (touch) phones.

We also test for Firefox 4 Multitouch Support.

Chrome (desktop) used to lie about its support on this, but that has since been rectified: http://crbug.com/36415
*/
define(['Modernizr', 'prefixes', 'testStyles'], function( Modernizr, prefixes, testStyles ) {
  Modernizr.addTest('touchevents', function() {
    var bool;
    if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      bool = true;
    } else {
      var query = ['@media (',prefixes.join('touch-enabled),('),'heartz',')','{#modernizr{top:9px;position:absolute}}'].join('');
      testStyles(query, function( node ) {
        bool = node.offsetTop === 9;
      });
    }
    return bool;
  }, {
    aliases : ['touch']
  });
});
