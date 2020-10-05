/*!
{
  "name": "IndexedDB Blob",
  "property": "indexeddbblob",
  "tags": ["storage"],
  "async": true
}
!*/
/* DOC
Detects if the browser can save File/Blob objects to IndexedDB
*/
define(['Modernizr', 'addTest', 'prefixed', 'test/indexeddb'], function(Modernizr, addTest, prefixed) {
  // Vendors had inconsistent prefixing with the experimental Indexed DB:
  // - Webkit's implementation is accessible through webkitIndexedDB
  // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
  // For speed, we don't test the legacy (and beta-only) indexedDB

  Modernizr.addAsyncTest(function() {
    Modernizr.on('indexeddb.deletedatabase', function(result) {
      if (!result) return;

      var indexeddb;
      var dbname = 'detect-blob-support';
      var openRequest;
      var db;
      var putRequest;

      try {
        indexeddb = prefixed('indexedDB', window);
      } catch (e) {
      }

      // Calling `deleteDatabase` in a try…catch because some contexts (e.g. data URIs)
      // will throw a `SecurityError`
      try {
        indexeddb.deleteDatabase(dbname).onsuccess = function() {
          openRequest = indexeddb.open(dbname, 1);
          openRequest.onupgradeneeded = function() {
            openRequest.result.createObjectStore('store');
          };
          openRequest.onsuccess = function() {
            db = openRequest.result;
            try {
              putRequest = db.transaction('store', 'readwrite').objectStore('store').put(new Blob(), 'key');
              putRequest.onsuccess = function() {
                addTest('indexeddbblob', true);
              };
              putRequest.onerror = function() {
                addTest('indexeddbblob', false);
              };
            }
            catch (e) {
              addTest('indexeddbblob', false);
            }
            finally {
              db.close();
              indexeddb.deleteDatabase(dbname);
            }
          };
        };
      }
      catch (e) {
        addTest('indexeddbblob', false);
      }
    });
  });
});
