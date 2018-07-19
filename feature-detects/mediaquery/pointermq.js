/*!
{
  "name": "Pointer Media Query",
  "property": "pointermq"
}
!*/
/* DOC
Detect support for Pointer based media queries
*/
define(['Modernizr', 'addTest', 'mq'], function(Modernizr, addTest, mq) {
  Modernizr.addTest('pointermq', mq(('(pointer:coarse),(pointer:fine),(pointer:none)')));
});
