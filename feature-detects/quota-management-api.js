
// Quota storage management API
// This API can be used to check how much quota an app/origin is using
// Currently only implemented in WebKit
// https://groups.google.com/a/chromium.org/group/chromium-html5/msg/5261d24266ba4366
// By Addy Osmani

Modernizr.addTest('quotamanagement', 
  !!('TEMPORARY' in webkitStorageInfo && 'PERSISTENT' in webkitStorageInfo) 
);
