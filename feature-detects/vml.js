/*!
{
  "name": "VML",
  "property": "vml",
  "tags": ["vml"],
  "authors": ["Craig Andrews (@candrews)"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/NOTE-VML"
  },{
    "name": "MSDN Documentation",
    "href": "https://docs.microsoft.com/en-us/windows/desktop/VML/msdn-online-vml-introduction"
  }]
}
!*/
/* DOC
Detects support for VML.
*/
define(['Modernizr', 'createElement', 'isSVG'], function(Modernizr, createElement, isSVG) {
  Modernizr.addTest('vml', function() {
    var containerDiv = createElement('div');
    var supports = false;
    var shape;

    if (!isSVG) {
      containerDiv.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
      shape = containerDiv.firstChild;
      if ('style' in shape) {
        shape.style.behavior = 'url(#default#VML)';
      }
      supports = shape ? typeof shape.adj === 'object' : true;
    }

    return supports;
  });
});
