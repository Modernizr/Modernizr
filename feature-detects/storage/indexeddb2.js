/*!
{
  "name": "IndexedDB 2.0",
  "property": "indexeddb2",
  "tags": ["storage"],
  "caniuse": "indexeddb2",
  "authors": ["Tan Zhen Yong (@Xenonym)"],
  "polyfills": ["indexeddb"],
  "async": true
}
!*/
/* DOC
Detects support for the IndexedDB 2.0 client-side storage API.
*/
define(['Modernizr', 'addTest', 'test/indexeddb'], function(Modernizr, addTest) {
  Modernizr.addAsyncTest(function() {
    Modernizr.on('indexeddb', function(result) {
      if (!result) return;
      addTest('indexeddb2', 'getAll' in IDBIndex.prototype);
    });
  });
});
