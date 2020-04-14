/*!
{
  "name": "Web SQL Database",
  "property": "websqldatabase",
  "caniuse": "sql-storage",
  "tags": ["storage"]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

// Chrome incognito mode used to throw an exception when using openDatabase
// It doesn't anymore.
Modernizr.addTest('websqldatabase', 'openDatabase' in _globalThis);

export default Modernizr.websqldatabase
