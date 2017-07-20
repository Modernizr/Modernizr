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
define(['Modernizr', 'testStyles', 'test/css/supports'], function(Modernizr, testStyles) {
  var supportsCssVariables = false;

  if (Modernizr.supports) {
    var defaultStyle = '#modernizr{background: blue}';
    var testCase = '@supports (--bg-var: red){#modernizr{background: var(--bg-var);}}';
    testStyles(defaultStyle + testCase, function(elm) {
      var computedStyle = window.getComputedStyle(elm);
      supportsCssVariables = computedStyle.getPropertyValue('background') === 'red';
    });
  }

  Modernizr.addTest('customproperties', supportsCssVariables);
});
