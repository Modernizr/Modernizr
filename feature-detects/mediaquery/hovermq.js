/*!
{
  "name": "Hover Media Query",
  "property": "hovermq"
}
!*/
/* DOC
Detect support for Hover based media queries
*/
define(['Modernizr', 'addTest', 'mq'], function(Modernizr, addTest, mq) {
  Modernizr.addTest('hovermq', mq('(hover)'));
});
