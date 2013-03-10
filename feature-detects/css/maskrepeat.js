/*!
{
  "name": "CSS Mask Repeat",
  "property": "lastchild",
  "tags": ["css"],
  "notes": [
    {
      "name": "Webkit blog on CSS Masks",
      "href": "http://www.webkit.org/blog/181/css-masks/"
    },
    {
      "name": "Safari Docs",
      "href": "http://developer.apple.com/library/safari/#documentation/InternetWeb/Conceptual/SafariVisualEffectsProgGuide/Masks/Masks.html"
    },
    {
      "name": "Mozilla css svg mask (not this)",
      "href": "http://developer.mozilla.org/en/CSS/mask"
    },
    {
      "name": "Combine with clippaths for awesomeness",
      "href": "http://generic.cx/for/webkit/test.html"
    }
  ]
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('cssmaskrepeat', testAllProps('maskRepeat'));
});
