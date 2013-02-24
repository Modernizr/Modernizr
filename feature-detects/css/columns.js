/*!
{
  "name": "CSS Columns",
  "property": "csscolumns",
  "caniuse": "feat=multicolumn",
  "aliases": [],
  "polyfills": [{
    "name": "css3-multi-column.js",
    "href": "http://www.csscripting.com/css-multi-column/",
    "notes": null
  }],
  "tags": ["css"],
  "knownBugs": [],
  "doc" : null,
  "authors": [],
  "warnings": [],
  "notes": []
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('csscolumns', testAllProps('columnCount'));
});
