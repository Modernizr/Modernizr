
// binaryType is truthy if there is support.. returns "blob" in new-ish chrome.
// plus.google.com/115535723976198353696/posts/ERN6zYozENV

Modernizr.addTest('websocketsbinary', function(){
  try {
    return !!(window.WebSocket && (new WebSocket('ws://.')).binaryType);
  } catch (e){
    return false;
  }
});
