
// Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
// except IE9 who retains it as hsla

Modernizr.addTest('hsla', function() {
	setCss('background-color:hsla(120,40%,100%,.5)');
	return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
});
