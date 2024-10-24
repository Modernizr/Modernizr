// feature-detects/fetch.js
Modernizr.addTest('fetch', function() {
  return typeof window.fetch === 'function';
});

