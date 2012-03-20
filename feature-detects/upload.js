Modernizr.addTest('upload', function(){
  var el = document.createElement('input');
  el.setAttribute('type', 'file');
  return !el.disabled;
});