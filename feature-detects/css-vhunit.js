
Modernizr.addTest('cssvhunit', function(){

  var div = document.createElement('div');
  try {
    div.style.fontSize = '3vh';
  } catch(er){}
  return /vh/.test(div.style.fontSize)

});
