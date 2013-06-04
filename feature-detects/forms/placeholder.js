/*!
{
  "name": "placeholder attribute",
  "property": "placeholder",
  "tags": ["forms", "attribute"]
}
!*/
/* DOC

Tests for placeholder attribute in inputs and textareas

*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  Modernizr.addTest('placeholder', ('placeholder' in createElement('input') && 'placeholder' in createElement('textarea')));
});
