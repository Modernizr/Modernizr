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

define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('publicKeyCredential', function() {
    if (window.PublicKeyCredential) {
      return true;
    }

    return false;
  });
});
