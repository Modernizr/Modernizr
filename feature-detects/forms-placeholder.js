
// mostly by mathias bynens
// https://github.com/mathiasbynens/Modernizr/commit/71932649b08e
// but fixed by paul irish

;(function(){
  
  var inputElem = document.createElement('input');

  Modernizr.input.placeholder = new Boolean('placeholder' in inputElem);

  if (Modernizr.input.placeholder){
  
    Modernizr.input.placeholder.input    = !!Modernizr.input.placeholder;
    Modernizr.input.placeholder.textarea = 'placeholder' in document.createElement('textarea');

  }
  
})();
