/*!
{
  "name": "input[file] Attribute",
  "property": "fileinput",
  "caniuse" : "forms",
  "tags": ["file", "forms", "input"],
  "builderAliases": ["forms_fileinput"]
}
!*/
/* DOC
Detects whether input type="file" is available on the platform

E.g. iOS < 6 and some android version don't support this

There is a bug in iOS v8.0 that prevents files from being uploaded
(see https://twitter.com/xeenon/status/515341288229462016)
*/
define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  Modernizr.addTest('fileinput', function() {
    if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
      return false;
    }
    if(/iP(hone|od|ad)/.test(navigator.platform) && /OS 8_0 like Mac OS X/.test(navigator.appVersion)) {
      return false;
    }
    var elem = createElement('input');
    elem.type = 'file';
    return !elem.disabled;
  });
});
