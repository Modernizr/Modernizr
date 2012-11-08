define(['Modernizr', 'addTest'], function( Modernizr, addTest ) {
  // by jussi-kalliokoski
  // This test is asynchronous. Watch out.
  // The test will potentially add garbage to console.

  Modernizr.addAsyncTest(function() {
    try {
      // we're avoiding using Modernizr._domPrefixes as the prefix capitalization on
      // these guys are notoriously peculiar.
      var BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder || window.OBlobBuilder || window.BlobBuilder;
      var URL         = window.MozURL || window.webkitURL || window.MSURL || window.OURL || window.URL;
      var data    = 'Modernizr';
      var bb      = new BlobBuilder();

      bb.append('this.onmessage=function(e){postMessage(e.data)}');

      var url     = URL.createObjectURL(bb.getBlob());
      var worker  = new Worker(url);

      bb = null;

      worker.onmessage = function(e) {
        worker.terminate();
        URL.revokeObjectURL(url);
        addTest('blobworkers', data === e.data);
        worker = null;
      };

      // Just in case...
      worker.onerror = function() {
        addTest('blobworkers', false);
        worker = null;
      };

      setTimeout(function() {
        addTest('blobworkers', false);
      }, 200);

      worker.postMessage(data);
    } catch (e) {
      addTest('blobworkers', false);
    }
  });
});
