
// Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
// except IE9 who retains it as hsla

Modernizr.addTest('hsla', function() {

  function contains( str, substr ) {
    return !!~('' + str).indexOf(substr);
  }

  var elem = document.createElement('div');
  var style = elem.style;
  style.cssText = 'background-color:hsla(120,40%,100%,.5)';

	return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
});
