define(['ModernizrProto', 'omPrefixes'], function(ModernizrProto, omPrefixes) {
  /**
   * List of JavaScript DOM values used for tests
   *
   * @memberof Modernizr
   * @optionName Modernizr._domPrefixes
   * @optionProp domPrefixes
   * @name _domPrefixes
   * @access public
   * @example
   *
   * Modernizr._domPrefixes is exactly the same as {@link _prefixes}, but rather
   * than kebab-case properties, all properties are their Capitalized variant
   *
   * ```js
   * Modernizr._domPrefixes === [ "Moz", "O", "ms", "Webkit" ];
   * ```
   */

  var domPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(' ') : []);
  ModernizrProto._domPrefixes = domPrefixes;
  return domPrefixes;
});
