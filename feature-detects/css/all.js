/*!
{
  "name": "cssall",
  "property": "cssall",
  "notes": [{
    "name": "Spec",
    "href": "http://dev.w3.org/csswg/css-cascade/#all-shorthand"
  }]
}
!*/
/* DOC
Detects support for the `all` css property, which is a shorthand to reset all css properties (except direction and unicode-bidi) to their original value
*/

define(['Modernizr', 'docElement'], function(Modernizr, docElement) {
  Modernizr.addTest('cssall', 'all' in docElement.style);
});
