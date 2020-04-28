/*!
{
  "name": "Workers from Blob URIs",
  "property": "blobworkers",
  "tags": ["performance", "workers"],
  "builderAliases": ["workers_blobworkers"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/workers/"
  }],
  "knownBugs": ["This test may output garbage to console."],
  "authors": ["Jussi Kalliokoski"],
  "async": true
}
!*/
/* DOC
Detects support for creating Web Workers from Blob URIs.
*/
import Modernizr, { addTest, createAsyncTestListener } from "../../src/Modernizr.js";
import _globalThis from '../../src/globalThis.js';

Modernizr.addAsyncTest(function() {
  try {
    // we're avoiding using Modernizr._domPrefixes as the prefix capitalization on
    // these guys are notoriously peculiar.
    var BlobBuilder = _globalThis.BlobBuilder;
    var URL = _globalThis.URL;
    if (Modernizr._config.usePrefix) {
      BlobBuilder = BlobBuilder || _globalThis.MozBlobBuilder || _globalThis.WebKitBlobBuilder || _globalThis.MSBlobBuilder || _globalThis.OBlobBuilder;
      URL = URL || _globalThis.MozURL || _globalThis.webkitURL || _globalThis.MSURL || _globalThis.OURL;
    }
    var data = 'Modernizr',
      blob,
      bb,
      worker,
      url,
      timeout,
      scriptText = 'this.onmessage=function(e){postMessage(e.data)}';

    try {
      blob = new Blob([scriptText], {type: 'text/javascript'});
    } catch (e) {
      // we'll fall back to the deprecated BlobBuilder
    }
    if (!blob) {
      bb = new BlobBuilder();
      bb.append(scriptText);
      blob = bb.getBlob();
    }

    url = URL.createObjectURL(blob);
    worker = new Worker(url);

    worker.onmessage = function(e) {
      addTest('blobworkers', data === e.data);
      cleanup();
    };

    // Just in case...
    worker.onerror = fail;
    timeout = setTimeout(fail, 200);

    worker.postMessage(data);
  } catch (e) {
    fail();
  }

  function fail() {
    addTest('blobworkers', false);
    cleanup();
  }

  function cleanup() {
    if (url) {
      URL.revokeObjectURL(url);
    }
    if (worker) {
      worker.terminate();
    }
    if (timeout) {
      clearTimeout(timeout);
    }
  }
});

export default createAsyncTestListener("blobworkers");
