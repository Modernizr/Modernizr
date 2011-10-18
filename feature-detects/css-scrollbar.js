// Stylable scrollbars detection
Modernizr.addTest('cssscrollbar', function() {

		// Tested Element
	var test = document.createElement('div'),

		// Fake body
		fake = false,
		root = document.body || (function () {
			fake = true;
			return document.documentElement.appendChild(document.createElement('body'));
		}()),

		property = 'scrollbar{width:0px;}';

	// Force scrollbar
	test.id = '__sb';
	test.style.overflow = 'scroll';
	test.style.width = '40px';

	// Apply scrollbar style for all vendors
	test.innerHTML = '&shy;<style>#' + 
						Modernizr._prefixes
							.join(property+' #__sb::')
							.split('#')
							.slice(1)
							.join('#') + 
						property + 
					'</style>';

	root.appendChild(test);

	// If css scrollbar is supported, than the scrollWidth should not be impacted
	var ret = 'scrollWidth' in test && test.scrollWidth == 40;

	// Cleaning
	document.body.removeChild(test);
	if (fake) {
		document.documentElement.removeChild(root);
	}
	return ret;
});