/*!
{
  "name": "CSS Custom Properties",
  "property": "csscustomproperties",
  "caniuse": "css-variables",
  "authors": ["Kruithne"],
  "tags": ["css"],
  "notes": [{
    "name": "MDN",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/--*"
  }, {
    "name": "WC3",
    "href": "https://www.w3.org/TR/css-variables/"
  }]
}
!*/
define(['Modernizr', 'testAllProps'], function(Modernizr, testAllProps) {
  Modernizr.addTest('csscustomproperties', testAllProps('--a', 0));
});
