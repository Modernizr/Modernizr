/*!
{
  "name": "IndexedDB Blob",
  "property": "indexeddbblob"
}
!*/
/* DOC
Detects if the browser can save File/Blob objects to IndexedDB
*/
import Modernizr, { addTest, createAsyncTestListener } from "../src/Modernizr.js";
import _globalThis from '../src/globalThis.js';
import prefixed from '../src/prefixed.js';
import './indexeddb.js';

// Vendors had inconsistent prefixing with the experimental Indexed DB:
// - Webkit's implementation is accessible through webkitIndexedDB
// - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
// For speed, we don't test the legacy (and beta-only) indexedDB

Modernizr.addAsyncTest(function() {
  var dbname = 'detect-blob-support';
  var supportsBlob = false;
  var indexeddb;
  var openRequest;
  var putRequest;
  var db;

  try {
    indexeddb = prefixed('indexedDB', _globalThis);
  } catch (e) {
  }

  if (!indexeddb) {
    return false;
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
            supportsBlob = true;
          };
          putRequest.onerror = function() {
            supportsBlob = false;
          };
        }
        catch (e) {
          supportsBlob = false;
        }
        finally {
          addTest('indexeddbblob', supportsBlob);
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

export default createAsyncTestListener("indexeddbblob");
