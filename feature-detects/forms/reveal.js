define(['Modernizr', 'selectorSupported'], function( Modernizr, selectorSupported ) {
  // testing for reveal feature in input fields of type password
  Modernizr.addTest('reveal', function() {
    return (
      selectorSupported('::reveal') ||
      selectorSupported('::-ms-reveal') || // only one that exists in the wild (IE 10) - http://msdn.microsoft.com/en-us/library/windows/apps/hh465773.aspx
      selectorSupported('::-webkit-reveal') ||
      selectorSupported('::-moz-reveal') ||
      selectorSupported('::-o-reveal')
    );
  });
});