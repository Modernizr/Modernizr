/*!
{
  "name": "CSS Display run-in",
  "property": "display-runin",
  "authors": ["alanhogan"],
  "tags": ["css"],
  "builderAliases": ["css_displayrunin"],
  "notes": [{
    "name": "CSS Tricks Article",
    "href": "https://web.archive.org/web/20111124041449/https://css-tricks.com/596-run-in/"
  },{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/198"
  }]
}
!*/
define(['Modernizr', 'testAllProps'], function(Modernizr, testAllProps) {
  Modernizr.addTest('displayrunin', testAllProps('display', 'run-in'),
    {aliases: ['display-runin']});
});
