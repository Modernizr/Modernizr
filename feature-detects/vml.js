/*!
{
  "name": "VML",
  "property": "vml",
  "caniuse": "vml",
  "tags": ["vml"],
  "authors": ["Craig Andrews (@candrews)"]
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
    shape.style.behavior = "url(#default#VML)";
    var supportsVml = shape ? typeof shape.adj == "object": true;
    return supportsVml;
  });
});
