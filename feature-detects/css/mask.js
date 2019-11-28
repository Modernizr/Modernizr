/*!
{
  "name": "CSS Mask",
  "caniuse": "css-masks",
  "property": "cssmask",
  "tags": ["css"],
  "builderAliases": ["css_mask"],
  "notes": [{
    "name": "Webkit blog on CSS Masks",
    "href": "https://webkit.org/blog/181/css-masks/"
  }, {
    "name": "Safari Docs",
    "href": "https://developer.apple.com/library/archive/documentation/InternetWeb/Conceptual/SafariVisualEffectsProgGuide/Masks/Masks.html"
  }, {
    "name": "CSS SVG mask",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/mask"
  }, {
    "name": "Combine with clippaths for awesomeness",
    "href": "https://web.archive.org/web/20150508193041/http://generic.cx:80/for/webkit/test.html"
  }]
}
!*/
define(['Modernizr', 'testAllProps'], function(Modernizr, testAllProps) {
  Modernizr.addTest('cssmask', testAllProps('maskRepeat', 'repeat-x', true));
});
