define(['createElement'], function( createElement ) {
  // After page load injecting a fake body doesn't work so check if body exists
  var body = document.body;
  // Can we use the real body or should we create a fake one.
  var fakeBody = body || createElement('body');

  if(!body) {
    fakeBody.fake = true;
  }

  return fakeBody;
});