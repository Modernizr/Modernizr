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
import { addTest } from '../../src/Modernizr.js';

var result = 'connection' in navigator && 'effectiveType' in navigator.connection

addTest('effectiveType', 'connection' in navigator && 'effectiveType' in navigator.connection)

export default result
