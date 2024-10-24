// feature-detects/intersectionobserver.js
Modernizr.addTest('intersectionobserver', function() {
  return 'IntersectionObserver' in window;
});

