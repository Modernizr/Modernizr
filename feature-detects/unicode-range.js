/*!
{
  "name": "Unicode Range",
  "property": "unicoderange",
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/2013/CR-css-fonts-3-20131003/#descdef-unicode-range"
  }, {
    "name": "24 Way article",
    "href": "https://24ways.org/2011/creating-custom-font-stacks-with-unicode-range"
  }]
}
!*/
import Modernizr from '../src/Modernizr.js';
import isSVG from '../src/isSVG.js';
import testStyles from '../src/testStyles.js';
import createElement from '../src/createElement.js';

Modernizr.addTest('unicoderange', function() {

  return testStyles('@font-face{font-family:"unicodeRange";src:local("Arial");unicode-range:U+0020,U+002E}#modernizr span{font-size:20px;display:inline-block;font-family:"unicodeRange",monospace}#modernizr .mono{font-family:monospace}', function(elem) {

    // we use specify a unicode-range of 002E (the `.` glyph,
    // and a monospace font as the fallback. If the first of
    // these test glyphs is a different width than the other
    // the other three (which are all monospace), then we
    // have a winner.
    var testGlyphs = ['.', '.', 'm', 'm'];

    for (var i = 0; i < testGlyphs.length; i++) {
      var elm = createElement('span');
      var classValue = i % 2 ? 'mono' : ''; 
      elm.innerHTML = testGlyphs[i];
      if (isSVG) {
        elm.className.baseVal = classValue
      } else {
        elm.className = classValue
      }
      elem.appendChild(elm);
      testGlyphs[i] = elm.clientWidth;
    }

    return (testGlyphs[0] !== testGlyphs[1] && testGlyphs[2] === testGlyphs[3]);
  });
});

export default Modernizr.unicoderange
