/*!
{
  "name": "Hover Media Query",
  "property": "hovermq",
  "notes": [{
    "name": "//Name of reference document",
    "href": "//URL of reference document"
  }]
}
!*/
/* DOC
Detect support for Hover based media queries
*/
define(['Modernizr', 'addTest', 'mq'], function(Modernizr, addTest, mq) {
  Modernizr.addTest('hovermq', mq(('(hover)')));
});
