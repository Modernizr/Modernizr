/*!
{
  "name": "CSS Grid (old & new)",
  "property": ["cssgrid", "cssgridlegacy"],
  "tags": ["css"],
  "notes": [{
    "name": "The new, standardized CSS Grid",
    "href": "https://www.w3.org/TR/css3-grid-layout/"
  }, {
    "name": "The _old_ CSS Grid",
    "href": "https://www.w3.org/TR/2011/WD-css3-grid-layout-20110407/"
  }],
  "warnings": ["`grid-columns` is only in the old syntax, `grid-column` exists in both and so `grid-template-rows` is used for the new syntax."]
}
!*/
define(['Modernizr', 'testAllProps'], function(Modernizr, testAllProps) {
  Modernizr.addTest('cssgridlegacy', testAllProps('grid-columns', '10px', true));
  Modernizr.addTest('cssgrid', testAllProps('grid-template-rows', 'none', true));
});
