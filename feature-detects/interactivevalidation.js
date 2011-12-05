Modernizr.addTest('interactivevalidation', function(){
	return !!document.createElement('form').checkValidity;
});