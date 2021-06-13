/*!
{
  "name": "Connection Effective Type",
  "notes": [{
    "name": "MDN documentation",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType"
  }],
  "property": "connectioneffectivetype",
  "builderAliases": ["network_connection"],
  "tags": ["network"]
}
!*/
/* DOC
Detects support for determining signal bandwidth via `navigator.connection.effectiveType`
*/
define(['Modernizr'], function (Modernizr) {
  Modernizr.addTest('effectiveType', function () {
    // polyfill
    var connection = navigator.connection || { effectiveType: 0 };

    if (connection.effectiveType !== 0) {
      return true;
    }

    return false;
  });
});
