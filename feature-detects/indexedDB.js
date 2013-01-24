
// Vendors had inconsistent prefixing with the experimental Indexed DB:
// - Webkit's implementation is accessible through webkitIndexedDB
// - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
// For speed, we don't test the legacy (and beta-only) indexedDB

Modernizr.addTest('indexedDB', !!Modernizr.prefixed("indexedDB", window));
