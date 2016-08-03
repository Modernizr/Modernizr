/*!
{
  "name": "Pointer Media Query",
  "property": "pointermq",
  "notes": [{
    "name": "//Name of reference document",
    "href": "//URL of reference document"
  }]
}
!*/
/* DOC
Detect support for Pointer based media queries
*/
define(['Modernizr', 'addTest', 'mq'], function(Modernizr, addTest, mq) {
  Modernizr.addTest('pointermq', mq(('(pointer:coarse),(pointer:fine),(pointer:none)')));
});
