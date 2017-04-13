/*!
{
  "name": "CSS Grid (old & new)",
  "property": ["cssgrid", "cssgridlegacy"],
  "authors": ["Faruk Ates"],
  "tags": ["css"],
  "notes": [{
    "name": "The new, standardized CSS Grid",
    "href": "https://www.w3.org/TR/css3-grid-layout/"
  }, {
    "name": "The _old_ CSS Grid (legacy)",
    "href": "https://www.w3.org/TR/2011/WD-css3-grid-layout-20110407/"
  }]
}
!*/
define(['Modernizr', 'testAllProps'], function(Modernizr, testAllProps) {
  // `grid-columns` is only in the old syntax, `grid-column` exists in both and so `grid-template-rows` is used for the new syntax.
  Modernizr.addTest('cssgridlegacy', testAllProps('grid-columns', '10px', true));
  Modernizr.addTest('cssgrid', testAllProps('grid-template-rows', 'none', true));
});
