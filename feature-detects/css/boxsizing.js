/*!
{
  "name": "Box Sizing",
  "property": "boxsizing",
  "caniuse": "css3-boxsizing",
  "polyfills": ["borderboxmodel", "boxsizingpolyfill", "borderbox"],
  "tags": ["css"],
  "builderAliases": ["css_boxsizing"],
  "notes": [{
    "name": "MDN Docs",
    "href": "http://developer.mozilla.org/en/CSS/box-sizing"
  },{
    "name": "Related Github Issue",
    "href": "http://github.com/Modernizr/Modernizr/issues/248"
  }]
}
!*/
define(['Modernizr', 'testAllProps'], function(Modernizr, testAllProps) {
  Modernizr.addTest('boxsizing', testAllProps('boxSizing', 'border-box', true) && (document.documentMode === undefined || document.documentMode > 7));
});
