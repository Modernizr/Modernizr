
// test by github.com/nsfmc

// "The 'rem' unit ('root em') is relative to the computed 
// value of the 'font-size' value of the root element."
// http://www.w3.org/TR/css3-values/#relative0
// you can test by checking if the prop was ditched

// http://snook.ca/archives/html_and_css/font-size-with-rem

Modernizr.addTest('cssremunit', function(){

  var div = document.createElement('div');
  div.style.fontSize = '3rem';
  return /rem/.test(div.style.fontSize)

});
