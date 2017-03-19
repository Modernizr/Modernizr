
Modernizr.addTest('cssvmunit', function(){

  var div = document.createElement('div');
  try {
    div.style.fontSize = '3vm';
  } catch(er){}
  return /vm/.test(div.style.fontSize)

});
