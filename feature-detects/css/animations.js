/*!
{
  "name": "CSS Animations",
  "property": "cssanimations",
  "aliases": [],
  "tags": ["css"],
  "knownBugs": ["Android < 4 will pass this test, but can only animate a single property at a time"],
  "doc" : null,
  "authors": [],
  "references": [{
    "href": "http://goo.gl/CHVJm"
  }]
}
!*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('cssanimations', function() {
    return testAllProps('animationName');
  });
});
