define(function() {
  // http://mathiasbynens.be/notes/xhr-responsetype-json#comment-4
  var testXhrType = function(type) {
    if (typeof XMLHttpRequest == 'undefined') {
      return false;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/', true);
    try {
      xhr.responseType = type;
    } catch(error) {
      return false;
    }
    return 'response' in xhr && xhr.responseType == type;
  };

  return testXhrType;
});
