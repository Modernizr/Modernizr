/*!
{
  "name": "Backdrop Filter",
  "property": "backdropfilter",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'testAllProps'], function(Modernizr, testAllProps) {
  Modernizr.addTest('backdropfilter', testAllProps('backdropFilter'));
});
