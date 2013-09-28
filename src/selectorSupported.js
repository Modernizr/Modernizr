define(['ModernizrProto', 'prefixes', 'testStyles'], function( ModernizrProto, prefixes, testStyles ) {
  /**
   * selectorSupported check if a css selector is supported
   *
   * @param selector - String naming the selector
   */
  function selectorSupported(selector){
    var support,
      prefixCheck,
      hasSelector = false,
      prefixLength = prefixes.length,
      parts = selector.match(/^(:*)([^:]*)$/i),
      sheet,
      doc = document,
      root = doc.documentElement,
      head = root.getElementsByTagName('head')[0],
      impl = doc.implementation || {
        hasFeature: function() {
          return false;
        }
      },
      link = doc.createElement("style");
    link.type = 'text/css';

    (head || root).insertBefore(link, (head || root).firstChild);

    sheet = link.sheet || link.styleSheet;

    if (!(sheet && selector)) return false;

    // Test support against CSS2 or CSS3
    support = impl.hasFeature('CSS2', '') ?
      function(selector) {
        try {
          sheet.insertRule(selector + '{ }', 0);
          sheet.deleteRule(sheet.cssRules.length - 1);
        } catch (e) {
          return false;
        }
        return true;
      } : function(selector) {
        sheet.cssText = selector + '{ }';
        return sheet.cssText.length !== 0 && !(/unknown/i).test(sheet.cssText) && sheet.cssText.indexOf(selector) === 0;
    };

    // Test for each prefix
    prefixCheck = function(selector) {
      while(prefixLength-- && !hasSelector) {
        hasSelector = support(parts[1]+prefixes[prefixLength]+parts[2]);
      }
      return hasSelector;
    };

    return prefixCheck(selector);
  }

  ModernizrProto.selectorSupported = selectorSupported;
  return selectorSupported;
});
