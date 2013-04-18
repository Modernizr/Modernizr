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
define(['Modernizr', 'testStyles', 'getStyle'], function( Modernizr, testStyles, getStyle ) {
  testStyles(' #modernizr { display: run-in; } ', function( elem, rule ) {
    var ret = getStyle(elem)['display'];

    Modernizr.addTest('displayrunin', ret == 'run-in', { aliases: ['display-runin'] });
  });
});
