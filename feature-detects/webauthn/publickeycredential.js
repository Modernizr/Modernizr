/*!
{
  "name": "PublicKeyCredential",
  "notes": [
    {
      "name": "MDN Documentation",
      "href": "https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential"
    },
    {
      "name": "Google Developers solution",
      "href": "https://developers.google.com/web/updates/2018/03/webauthn-credential-management#the_solution"
    }
  ],
  "property": "publickeycredential",
  "tags": ["webauthn", "web authentication"],
  "authors": ["Eric Delia"]
}
!*/
/* DOC
Detects support for PublicKeyCredential as part of the Web Authentication API (also known as webauthn)
*/

import Modernizr from '../../src/Modernizr.js';
import _globalThis from '../../src/globalThis.js';

Modernizr.addTest('publicKeyCredential', 'PublicKeyCredential' in _globalThis);

export default Modernizr.publicKeyCredential
