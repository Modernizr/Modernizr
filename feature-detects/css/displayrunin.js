/*!
{
  "name": "CSS Display run-in",
  "property": "displayrunin",
  "aliases": ["displayrunin"],
  "authors": ["alanhogan"],
  "tags": ["css"],
  "builderAliases": ["css_displayrunin"],
  "notes": [{
    "name": "CSS Tricks Article",
    "href": "http://css-tricks.com/596-run-in/"
  },{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/198"
  }]
}
!*/
/* DOC
Detects support for the `run-in` value for the `display` CSS property, which allows e.g. headings to appear as part of the first line of a paragraph.
*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('displayrunin', testAllProps('display', 'run-in'),
    { aliases: ['display-runin'] });
});
