/*!
{
  "name": "VML",
  "property": "vml",
  "caniuse": "vml",
  "tags": ["vml"],
  "authors": ["Craig Andrews (@candrews)"],
  "notes": [{
    "name" : "W3C VML reference",
    "href": "http://www.w3.org/TR/NOTE-VML"
  },{
    "name" : "Microsoft VML reference",
    "href": "http://msdn.microsoft.com/en-us/library/bb263898%28VS.85%29.aspx"
  }]
}
!*/
/* DOC
Detects support for VML.
*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('vml', function() {
    var containerDiv = createElement('div');
    containerDiv.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
    var shape = containerDiv.firstChild;
    shape.style.behavior = 'url(#default#VML)';
    var supportsVml = shape ? typeof shape.adj == 'object': true;
    return supportsVml;
  });
});
