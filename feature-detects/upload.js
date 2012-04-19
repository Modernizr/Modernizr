/**
 * File upload support
 *
 * It's useful if you want to hide the upload feature of your app on devices that
 * don't support it (iphone, ipad, etc).
 * 
 * Detection is made by testing if the new created upload field is disabled or not.
 * If it's disabled, most likely the browser does not support upload.
 *
 * By Mircea Georgescu
  */
Modernizr.addTest('upload', function(){
  var el = document.createElement('input');
  el.setAttribute('type', 'file');
  return !el.disabled;
});