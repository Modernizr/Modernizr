/*!
{
  "name": "CSS Display run-in",
  "property": "display-runin",
  "authors": ["alanhogan"],
  "tags": ["css"],
  "notes": [{
    "name": "CSS Tricks Article",
    "href": "http://css-tricks.com/596-run-in/"
  },{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/198"
  }]
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('displayrunin', testAllProps('display', 'run-in'),
    { aliases: ['display-runin'] });
});
