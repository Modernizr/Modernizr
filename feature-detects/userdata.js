//test if IE userdata supported

Modernizr.addTest('userdata', function(){
  return !!document.createElement('div').addBehavior;
});