
Modernizr.addTest('cssvwunit', function(){

  var div = document.createElement('div');
  try {
    div.style.fontSize = '3vw';
  } catch(er){}
  return /vw/.test(div.style.fontSize)

});
