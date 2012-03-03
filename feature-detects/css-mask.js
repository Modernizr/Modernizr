
// this tests passes for webkit's proprietary `-webkit-mask` feature
// as well as mozilla's implementation of `mask` for SVG

// http://www.webkit.org/blog/181/css-masks/
// http://developer.apple.com/library/safari/#documentation/InternetWeb/Conceptual/SafariVisualEffectsProgGuide/Masks/Masks.html

// https://developer.mozilla.org/en/CSS/mask
// https://developer.mozilla.org/En/Applying_SVG_effects_to_HTML_content

// Can combine with clippaths for awesomeness: http://generic.cx/for/webkit/test.html

Modernizr.addTest('cssmask', Modernizr.testAllProps('mask'));
