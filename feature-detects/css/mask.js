/*!
{
  "name": "CSS Mask",
  "caniuse": "css-masks",
  "property": "cssmask",
  "tags": ["css"],
  "notes": [
    "This is for the -webkit-mask feature, not for the similar svg mask in Firefox.",
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
  Modernizr.addTest('cssmask', testAllProps('maskRepeat', 'repeat-x', true));
});
