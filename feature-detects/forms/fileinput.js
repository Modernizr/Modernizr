define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {

  // Detects whether input type="file" is available on the platform
  // E.g. iOS < 6 and some android version don't support this

  //  It's useful if you want to hide the upload feature of your app on devices that
  //  don't support it (iphone, ipad, etc).

  Modernizr.addTest('fileinput', function() {
    if(navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
        return false;
    }
    var elem = createElement('input');
    elem.type = 'file';
    return !elem.disabled;
  });
});
