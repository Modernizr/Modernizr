// This implementation is rather compact. The reason is that it makes some
// assumptions, which are based on the W3C spec and lots of tests (see the test
// case [here](http://jsfiddle.net/gravof/nUN8k/14/), so it is highly likely that
// they will be correct in most current & future browsers. The following is a
// list of these assumptions:
//
// 1.  If "required" validation is not supported, then other types of
//     validations (e.g., min, max, email, url) are not supported.
// 2.  If "required" validation triggers "invalid" event when form is submitted,
//     then other types of validations also trigger "invalid" event.
// 3.  If "invalid" event is fired, form will be prevented from submitting.
Modernizr.interactivevalidation = (function(document) {
	// Assuption No.1
	if (!Modernizr.input.required) {
		return false;
	}

	var form = document.createElement('form');

	// Prevent form from being submitted
	form.onsubmit = function(e) {
		e.preventDefault();
	}

	// Calling form.submit() doesn't trigger interactive validation, 
	// use a submit button instead
	form.innerHTML = '<input required><button></button>';

	// FF4 doesn't trigger "invalid" event if form is not in the DOM tree
	// Chrome throws error if invalid input is not visible when submitting 
	form.style.position = 'absolute';
	form.style.top = '-99999em'

	// We might in <head> in which case we need to create body manually
	var body = document.body;
	var html = document.documentElement;
	var bodyFaked = false;
	if (!body) {
		bodyFaked = true;
		body = document.createElement('body');
		html.appendChild(body);
	}
	document.body.appendChild(form);

	var input = form.getElementsByTagName('input')[0];	

	// Record whether "invalid" event is fired
	var invaildFired = false;
	input.oninvalid = function() {
		invaildFired = true;
	};

	// Submit form by clicking submit button
	var button = form.getElementsByTagName('button')[0];
	button.click();
	// FF5 in Mac displays the talking bubble
	// even if the form is outsite the viewport
	input.blur();

	// Don't forget to clean up
	body.removeChild(form);
	bodyFaked && html.removeChild(body);

	return invaildFired;
})(document);