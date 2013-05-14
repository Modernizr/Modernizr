/*!
{
  "name": "CSS Transitions",
  "property": "csstransitions",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('csstransitions', testAllProps('transition'));
});
