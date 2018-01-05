/*!
{
  "name": "CSS Custom Properties",
  "property": "csscustomproperties",
  "caniuse": "css-variables",
  "tags": ["css"],
  "builderAliases": ["css_customproperties"],
  "notes": [{
    "name": "W3 Spec",
    "href": "https://drafts.csswg.org/css-variables/"
  }]
}
!*/
define(['Modernizr'], function(Modernizr) {
  var supportsFn = (window.CSS && window.CSS.supports.bind(window.CSS)) || (window.supportsCSS);
  Modernizr.addTest('customproperties', !!supportsFn && supportsFn('color', 'var(--primary)'));
});
