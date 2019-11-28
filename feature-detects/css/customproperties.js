/*!
{
  "name": "CSS Custom Properties",
  "property": "customproperties",
  "caniuse": "css-variables",
  "tags": ["css"],
  "builderAliases": ["css_customproperties"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/--*"
  }, {
    "name": "W3C Spec",
    "href": "https://drafts.csswg.org/css-variables/"
  }]
}
!*/
define(['Modernizr'], function(Modernizr) {
  var supportsFn = (window.CSS && window.CSS.supports.bind(window.CSS)) || (window.supportsCSS);
  Modernizr.addTest('customproperties', !!supportsFn && (supportsFn('--f:0') || supportsFn('--f', 0)));
});
