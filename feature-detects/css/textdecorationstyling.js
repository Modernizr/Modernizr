/*!
{
  "name": "CSS text-decoration styling",
  "property": "textdecorationstyling",
  "caniuse": "text-decoration styling",
  "tags": ["css"],
  "notes": [{
    "name" : "w3c explanation of individual text-decoration properties",
    "href": "https://www.w3.org/TR/css-text-decor-3/#line-decoration"
  }]
}
!*/
/* DOC
Detects whether or not text-decoration styling 
 (i.e. defining color, position and type of text decorations) is possible.
*/
define(['Modernizr', 'testAllProps'], function(Modernizr, testAllProps) {
  Modernizr.addTest('textdecorationstyling', testAllProps('text-decoration-color'));
});
