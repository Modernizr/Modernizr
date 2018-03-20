/*!
{
  "name": "CSS Transforms 3D",
  "property": "csstransforms3d",
  "caniuse": "transforms3d",
  "tags": ["css"],
  "warnings": [
    "Chrome may occassionally fail this test on some systems; more info: https://code.google.com/p/chromium/issues/detail?id=129004"
  ]
}
!*/
define(['Modernizr', 'testAllProps', 'test/css/supports'], function(Modernizr, testAllProps) {
  Modernizr.addTest('csstransforms3d', function() {
    return !!testAllProps('perspective', '1px', true);
  });
});
