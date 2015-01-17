/*!
{
  "name": "CSS Background Clip Text",
  "property": "backgroundcliptext",
  "authors": ["ausi"],
  "tags": ["css"],
  "notes": [
    {
      "name": "CSS Tricks Article",
      "href": "http://css-tricks.com/image-under-text/"
    },
    {
      "name": "MDN Docs",
      "href": "http://developer.mozilla.org/en/CSS/background-clip"
    },
    {
      "name": "Related Github Issue",
      "href": "http://github.com/Modernizr/Modernizr/issues/199"
    }
  ]
}
!*/
/* DOC
Detects the ability to mask an element's background to the shape of its text, which can be used for image-filled text effects
*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
  Modernizr.addTest('backgroundcliptext', function() {
    return testAllProps('backgroundClip', 'text');
  });
});
