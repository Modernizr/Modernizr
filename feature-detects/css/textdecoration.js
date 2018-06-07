/*!
{
  "name": "CSS textDecoration",
  "property": "skipink",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'testProp'], function(Modernizr, testProp) {
  Modernizr.addTest('skipInk', testProp('textDecorationSkipInk', 'auto'));
});
