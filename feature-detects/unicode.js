/*!
{
  "name": "Unicode characters",
  "property": "unicode",
  "tags": ["encoding"],
  "warnings": [
    "positive Unicode support doesn't mean you can use it inside <title>, this seems more related to OS & Language packs"
  ]
}
!*/
/* DOC
Detects if unicode characters are supported in the current document.
*/
define(['Modernizr', 'createElement', 'testStyles', 'isSVG'], function(Modernizr, createElement, testStyles, isSVG) {
  /**
   * Unicode special character support
   *
   * Detection is made by testing the missing glyph box rendering against the comet character. If widths are the same,
   * this "probably" means the browser didn't support the comet character and rendered a glyph box instead. Just need
   * to ensure the font characters have different widths.
   */
  Modernizr.addTest('unicode', function() {
    var bool;
    var missingGlyph = createElement('span');
    var comet = createElement('span');

    testStyles('#modernizr{font-family:Arial,sans;font-size:300em;}', function(node) {

      missingGlyph.innerHTML = isSVG ? '\u5987' : '&#5987;';
      comet.innerHTML = isSVG ? '\u2604' : '&#9732;';

      node.appendChild(missingGlyph);
      node.appendChild(comet);

      bool = 'offsetWidth' in missingGlyph && missingGlyph.offsetWidth !== comet.offsetWidth;
    });

    return bool;
  });
});
