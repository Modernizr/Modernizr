/*!
{
  "name": "CSS Transforms Level 2",
  "property": "csstransformslevel2",
  "authors": ["rupl"],
  "tags": ["css"],
  "notes": [{
    "name": "CSSWG Draft Spec",
    "href": "https://drafts.csswg.org/css-transforms-2/"
  }]
}
!*/
define(['Modernizr', 'testAllProps'], function(Modernizr, testAllProps) {
  Modernizr.addTest('csstransformslevel2', function() {
    return testAllProps('translate', '45px', true);
  });
});
