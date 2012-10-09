
// by tauren
// https://github.com/Modernizr/Modernizr/issues/191

Modernizr.addTest('cookies', function () {

  // navigator.cookieEnabled is in IE9 but always true. Don't rely on it.

  // Create cookie
  document.cookie = "cookietest=1";
  var ret = document.cookie.indexOf("cookietest=") != -1;
  // Delete cookie
  document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
  return ret;
});

