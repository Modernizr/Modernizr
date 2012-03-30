// CSS Regions
// http://www.w3.org/TR/css3-regions/
// By: Mihai Balan

// Simple, CSS parser based
Modernizr.addTest('regions',
	Modernizr.testAllProps('flowInto')
);

// More complete, behavior based version
Modernizr.addTest('regions', function() {
	if (Modernizr.testAllProps('flowInto')) {
		var style = 'position: fixed; width: 20px; height: 20px; visibility: hidden;';
		var contentStyle = 'top: -50px; left: -50px;';
		var regionStyle = 'top: -100px; left: 0px;';

		var contentDiv = document.createElement('div');
		contentDiv.style.cssText = style + contentStyle;
		contentDiv.style[Modernizr.prefixed('flowInto')] = 'f1';
		
		var regionDiv = document.createElement('div');
		regionDiv.style.cssText = style + regionStyle;
		regionDiv.style[Modernizr.prefixed('flowFrom')] = 'f1';

		var contentRect = contentDiv.getBoundingClientRect();

		delete contentDiv;
		delete regionDiv;

		if (contentRect.left < 0) {
			return false;
		} else {
			return true;
		}
	} else {
		return false;
	}
});