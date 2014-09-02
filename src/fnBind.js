define(function() {
  // Change the function's scope.
  function fnBind(fn, that) {
    return function() {
      return fn.apply(that, arguments);
    };
  }

  return fnBind;
});
