
// @font-face detection routine by Diego Perini
// javascript.nwbox.com/CSSSupport/

// false positives:
//   WebOS github.com/Modernizr/Modernizr/issues/342
//   WP7   github.com/Modernizr/Modernizr/issues/538
Modernizr.addTest('fontface', function() {
    var bool;

    Modernizr.testStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
      var style = document.getElementById('smodernizr'),
          sheet = style.sheet || style.styleSheet,
          cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

      bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
    });

    return bool;
});
