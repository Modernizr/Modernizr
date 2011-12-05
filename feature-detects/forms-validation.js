
// interactive form validation
// www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#interactively-validate-the-constraints

// This easy test can false positive in Safari 5.0.5 which had checkValidity, but
//   it did not block forms from submitting.
//   For a more comprehensive detect to handle that case, please see:
//   github.com/Modernizr/Modernizr/pull/315

Modernizr.addTest('formvalidation', function(){
    return typeof document.createElement('form').checkValidity == 'function';
});
