
// css-tricks.com/rgba-browser-support/

Modernizr.addTest('rgba', function() {
	setCss('background-color:rgba(150,255,150,.5)');
	return contains(mStyle.backgroundColor, 'rgba');
});
