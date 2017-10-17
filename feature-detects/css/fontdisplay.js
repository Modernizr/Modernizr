/*!
{
  "name": "Font Display",
  "property": "fontdisplay",
  "notes": [{
    "name": "W3C CSS Fonts Module Level 4",
    "href": "https://drafts.csswg.org/css-fonts-4/#font-display-desc"
  },{
    "name": "`font-display` for the masses",
    "href": "https://css-tricks.com/font-display-masses/"
  }]
}
!*/
/* DOC
Detects support for the `font-display` descriptor, which defines how font files are loaded and displayed by the browser.
*/
define(['Modernizr'], function(Modernizr) {
  Modernizr.addTest('fontdisplay', function() {
    try {
      var e = document.createElement('style');
      e.textContent = '@font-face { font-display: swap; }';
      document.documentElement.appendChild(e);
      var isSupported = e.sheet.cssRules[0].cssText.indexOf('font-display') != -1;
      e.remove();
      return isSupported;
    } catch (e) {
      return false;
    }
  });
});
