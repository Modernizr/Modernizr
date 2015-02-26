define(function() {
  // Change the function's scope.
  function roundedEquals(a, b) {
    return a - 1 === b || a === b || a + 1 === b;
  }

  return roundedEquals;
});
