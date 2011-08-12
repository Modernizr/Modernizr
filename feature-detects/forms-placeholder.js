// @mathias was here

;(function() {

  var inputPlaceholder = Modernizr.input.placeholder = 'placeholder' in document.createElement('input');

  if (inputPlaceholder) {
    (Modernizr.textarea || (Modernizr.textarea = {})).placeholder = 'placeholder' in document.createElement('textarea');
  }
  
}());
