define(['Modernizr', 'addTest'], function( Modernizr, addTest ) {
  // data uri test.
  // https://github.com/Modernizr/Modernizr/issues/14

  // This test is asynchronous. Watch out.

  // in IE7 in HTTPS this can cause a Mixed Content security popup.
  //  github.com/Modernizr/Modernizr/issues/362
  // To avoid that you can create a new iframe and inject this.. perhaps..

  Modernizr.addAsyncTest(function() {
    var datauri = new Image();

    datauri.onerror = function() {
      addTest('datauri', false);
    };
    datauri.onload = function() {
      addTest('datauri', datauri.width == 1 && datauri.height == 1);
    };

    datauri.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  });
});
