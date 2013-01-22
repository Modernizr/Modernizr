define(['Modernizr', 'testStyles'], function( Modernizr, testStyles ) {
  // @font-face detection routine by Diego Perini
  // javascript.nwbox.com/CSSSupport/

  // false positives:
  //   WebOS github.com/Modernizr/Modernizr/issues/342
  //   WP7   github.com/Modernizr/Modernizr/issues/538
  testStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
    var style = document.getElementById('smodernizr');
    var sheet = style.sheet || style.styleSheet;
    var cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';
    var bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;

    Modernizr.addTest('fontface', bool);
  });

});
