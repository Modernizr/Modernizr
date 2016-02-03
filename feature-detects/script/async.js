/*!
{
  "name": "script[async]",
  "property": "scriptasync",
  "caniuse": "script-async",
  "tags": ["script"],
  "builderAliases": ["script_async"],
  "authors": ["Theodoor van Donge"]
}
!*/
/* DOC
Detects support for the `async` attribute on the `<script>` element.
*/
import Modernizr from 'Modernizr';

import createElement from 'createElement';
Modernizr.addTest('scriptasync', 'async' in createElement('script'));
