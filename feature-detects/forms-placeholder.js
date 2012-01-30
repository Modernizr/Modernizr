// testing for placeholder attribute in inputs and textareas
// re-using Modernizr.input if available

Modernizr.addTest('placeholder', function(){  
  return !!('placeholder' in (Modernizr.input || document.createElement('input')) && 'placeholder' in (Modernizr.textarea || document.createElement('textarea')) );
});
