// mostly by mathias bynens
// https://github.com/mathiasbynens/Modernizr/commit/71932649b08e
// but fixed by paul irish

;(function(){
  
  var inputElem = document.createElement('input');

  Modernizr.input.placeholder = 'placeholder' in inputElem;
  
  /*
   * When using new Boolean above and the result of 'placeholder' in inputElem is false
   * the below will evaluate to true so, in Firefox 3.6 for example, Modernizr.input.placeholder.input 
   * will be set to true even though placeholder is not supported.
   */
  if (Modernizr.input.placeholder){
  
    Modernizr.input.placeholder.input    = !!Modernizr.input.placeholder;
    Modernizr.input.placeholder.textarea = 'placeholder' in document.createElement('textarea');

  }
  
})();
