/*!
{
  "name": "Low Bandwidth Connection",
  "property": "lowbandwidth",
  "tags": ["network"],
  "builderAliases": ["network_connection"]
}
!*/
/* DOC
Tests for determining low-bandwidth via `navigator.connection`

There are two iterations of the `navigator.connection` interface.

The first is present in Android 2.2+ and only in the Browser (not WebView)

- http://docs.phonegap.com/en/1.2.0/phonegap_connection_connection.md.html#connection.type
- https://davidbcalhoun.com/2010/using-navigator-connection-android

The second is speced at https://dvcs.w3.org/hg/dap/raw-file/tip/network-api/Overview.html and perhaps landing in WebKit

- https://bugs.webkit.org/show_bug.cgi?id=73528

Unknown devices are assumed as fast

For more rigorous network testing, consider boomerang.js: https://github.com/bluesmoon/boomerang/
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('lowbandwidth', function() {
    // polyfill
    var connection = navigator.connection || {type: 0};

    return connection.type === 3 || // connection.CELL_2G
      connection.type === 4 || // connection.CELL_3G
      /^[23]g$/.test(connection.type); // string value in new spec
  });
});
