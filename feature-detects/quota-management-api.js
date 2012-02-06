
// Quota storage management API
// This API can be used to check how much quota an origin is using and request more

// Currently only implemented in WebKit
// https://groups.google.com/a/chromium.org/group/chromium-html5/msg/5261d24266ba4366
// By Addy Osmani

Modernizr.addTest('quotamanagement', function(){
  var storage = Modernizr.prefixed('StorageInfo', window);
  return !!(storage && 'TEMPORARY' in storage && 'PERSISTENT' in storage);
});
