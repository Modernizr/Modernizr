
// AJAX
// https://github.com/Modernizr/Modernizr/issues/734

Modernizr.addTest('ajax', function() {
	var xhr = new XMLHttpRequest();
	return !!('onprogress' in xhr);
});