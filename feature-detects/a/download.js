define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // a[download] attribute
  // When used on an <a>, this attribute signifies that the resource it
  // points to should be downloaded by the browser rather than navigating to it.
  // http://developers.whatwg.org/links.html#downloading-resources

  Modernizr.addTest('adownload', 'download' in createElement('a'));
});
