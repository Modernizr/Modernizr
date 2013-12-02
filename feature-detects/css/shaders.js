/*!
  {
  "name": "CSS Shaders",
  "property": "cssshaders",
  "tags": ["css", "filters"],
  "notes": [{
  "name": "About CSS Custom Filters",
  "href": "http://adobe.github.io/web-platform/samples/css-customfilters/"
  }]
  }
  !*/
/* DOC

   Detects support for CSS custom shaders (aka custom filers)

*/
define(['Modernizr', 'testStyles'], function (Modernizr, testStyles) {
  // The spec has changed from an inline rule, to an at-rule based one.
  // So we need to test for both, returning true if either.

  Modernizr.addTest('cssshaders', function() {
    var prefixes = Modernizr._prefixes;

    return testStyles('div{' + prefixes.join('filter: custom(none mix(url()));') + '}', function(node, rule) {
      var style = document.getElementById('smodernizr');
      var sheet = style.sheet || style.styleSheet;
      var cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';
      var supportsInline = /custom/i.test(cssText);
      var supportsAtRule;

      if (supportsInline) {
        //skip the other test if inline is supported
        return true;
      }

      for (var i = 0; i < prefixes.length; i++) {
        try {
          var filterRule = sheet.insertRule('@' + prefixes[i] + 'filter test-filter {}', sheet.rules.length - 1);
          filterRule = sheet.cssRules.item(filterRule);
          supportsAtRule = filterRule.type == 17;
          i = prefixes.length;
        }
        catch (e) {}
      }

      return supportsAtRule;

    });
  });
});
