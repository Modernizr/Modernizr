/*!
{
  "name": "Dart",
  "property": "dart",
  "authors": ["Theodoor van Donge"],
  "notes": [{
    "name": "Language website",
    "href": "https://www.dartlang.org/"
  }]
}
!*/
/* DOC
Detects native support for the Dart programming language.
*/
import Modernizr from '../src/Modernizr.js';
import prefixed from '../src/prefixed.js';
import _globalThis from '../src/globalThis.js';

Modernizr.addTest('dart', !!prefixed('startDart', _globalThis.navigator));

export default Modernizr.dart
