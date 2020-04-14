/*!
{
  "name": "ES5 Syntax",
  "property": "es5syntax",
  "notes": [{
    "name": "ECMAScript 5.1 Language Specification",
    "href": "https://www.ecma-international.org/ecma-262/5.1/"
  }, {
    "name": "original implementation of detect code",
    "href": "https://kangax.github.io/compat-table/es5/"
  }],
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "warnings": ["This detect uses `eval()`, so CSP may be a problem."],
  "tags": ["es5"]
}
!*/
/* DOC
Check if browser accepts ECMAScript 5 syntax.
*/
import Modernizr from '../../src/Modernizr.js';
import testSyntax from '../../src/testSyntax.js';

Modernizr.addTest('es5syntax', function() {
  var obj, stringAccess, getter, setter, reservedWords, zeroWidthChars;
  try {
    // Property access on strings
    stringAccess = testSyntax('"foobar"[3] === "b"');
    // Getter in property initializer
    getter = testSyntax('({ get x(){} })');
    // Setter in property initializer
    setter = testSyntax('({ set x(v){} })');

    // Reserved words as property names
    // eslint-disable-next-line no-eval
    eval('obj = ({ if: 1 })');
    reservedWords = obj['if'] === 1;
    // Zero-width characters in identifiers
    zeroWidthChars = testSyntax('var a\u200c\u200d = 1');

    return stringAccess && getter && setter && reservedWords && zeroWidthChars;
  } catch (ignore) {
    return false;
  }
});

export default Modernizr.es5syntax
