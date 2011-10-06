// data uri test.
// https://github.com/Modernizr/Modernizr/issues/14


// This test is asynchronous. Watch out.

(function(){

  var datauri = new Image();


  datauri.onerror = function() {
      Modernizr.addTest('datauri', function () { return false; });
  };  
  datauri.onload = function() {
      Modernizr.addTest('datauri', function () { return (datauri.width == 1 && datauri.height == 1); });
  };

  datauri.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

})();