define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('restParameters', function() {
    try {
      // eslint-disable-next-line
      eval('var { ...rest } = { a:1}');
    } catch (e) {
      return false;
    }
    return true;
  });
});
