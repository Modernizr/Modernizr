define(['slice'], function( slice ) {
  // Not implemented as a polyfill, as that would change the environment,
  // which isn’t something Modernizr should do

  // Defer to native .bind if available
  if ('bind' in Function.prototype) {
    return function fnBind (fn, that) {
      return fn.bind(that);
    };
  }

  // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
  // es5.github.com/#x15.3.4.5
  function fnBind (fn, that) {

    var target = fn;

    if (typeof target != 'function') {
      throw new TypeError();
    }

    var args = slice.call(arguments, 2);
    var bound = function() {

      if (fn instanceof bound) {

        var F = function(){};
        F.prototype = target.prototype;
        var self = new F();

        var result = target.apply(
          self,
          args.concat(slice.call(arguments))
        );
        if (Object(result) === result) {
          return result;
        }
        return self;

      } else {

        return target.apply(
          that,
          args.concat(slice.call(arguments))
        );

      }

    };

    return bound;

  }

  return fnBind;
});
