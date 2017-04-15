/* Check for the min/max height + border-box bug
 * When a min or max height is set on a block, Firefox < 17 and IE < 9 ignore box-sizing: border-box
 * and add any padding to the element's height.
 * adapted from https://shanetomlinson.com/2012/box-sizing-border-box-padding-and-min-height-bug-in-firefox-and-ie/
 */
Modernizr.addTest('minmaxheightbug', function() {
	return Modernizr.testStyles('#modernizr {-moz-box-sizing:border-box; -webkit-box-sizing:border-box; box-sizing:border-box; min-height:1px; padding-top:1px}', function(elem) {
			return elem.scrollHeight === 2;
	});
});
