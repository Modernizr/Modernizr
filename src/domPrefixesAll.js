define(['ModernizrProto', 'domPrefixes'], function(ModernizrProto, domPrefixes) {
  /**
   * List of JavaScript DOM values used for tests including a NON-prefix
   *
   * @memberOf Modernizr
   * @name Modernizr._domPrefixesAll
   * @optionName Modernizr._domPrefixesAll
   * @optionProp domPrefixesAll
   * @access public
   * @example
   *
   * Modernizr._domPrefixesAll is exactly the same as [_domPrefixes](#modernizr-_domPrefixes), but also
   * adds an empty string in the array to test for a non-prefixed value
   *
   * ```js
   * Modernizr._domPrefixesAll === [ "", "Moz", "O", "ms", "Webkit" ];
   * ```
   */
  var domPrefixesAll = [''].concat(domPrefixes);
  ModernizrProto._domPrefixesAll = domPrefixesAll;
  return domPrefixesAll;
});
