/*!
{
  "name": "CSS Columns",
  "property": "csscolumns",
  "caniuse": "multicolumn",
  "aliases": [],
  "polyfills": [{
    "name": "css3-multi-column.js",
    "author": "Cdric Savarese",
    "href": "http://www.csscripting.com/css-multi-column/",
    "license": "CC-GNU LGPL",
    "notes": [
      "Supported Properties: column-count, column-width, column-gap, column-rule.",
      "Unsupported Properties: column-rule-width (use column-rule instead), column-rule-style (use column-rule instead), column-rule-color (use column-rule instead), column-span, column-width-policy, column-space-distribution"
    ]
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
