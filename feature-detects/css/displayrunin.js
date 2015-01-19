/*!
{
  "name": "CSS Display run-in",
  "property": "display-runin",
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
Detects support for `display: run-in`. It allows you to effect the display of a header and make it appear as though it's part of a block of text.
*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('displayrunin', testAllProps('display', 'run-in'),
    { aliases: ['display-runin'] });
});
