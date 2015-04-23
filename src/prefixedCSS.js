define(['ModernizrProto', 'prefixed', 'domToCSS'], function(ModernizrProto, prefixed, domToCSS) {
  // Modernizr.prefixedCSS() is like Modernizr.prefixed(), but returns the result in
  // hyphenated form, e.g.:
  // Modernizr.prefixedCSS('transition') // '-moz-transition'

  // It’s only suitable for style properties.

  // Properties can be passed as DOM-style camelCase or CSS-style kebab-case.
  // Return values will always be the hyphenated variant, or `false` if not supported
  var prefixedCSS = ModernizrProto.prefixedCSS = function(prop) {
    var prefixedProp = prefixed(prop);
    return prefixedProp && domToCSS(prefixedProp);
  };
  return prefixedCSS;
});
