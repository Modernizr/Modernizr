define(['ModernizrProto', 'docElement'], function( ModernizrProto, docElement) {
  // List of property values to set for css tests. See ticket #21
  var prefixes = [];
  var prefix;
  var styles;

  if (ModernizrProto._config.usePrefixes) {
    // Empty string for prefixless support
    prefixes.push('');

    // old ie does not have a getComputedStyle, but does offer the MS specific
    // 'currentStyle', so if it exists, we are -ms-
    if ('currentStyle' in docElement) {
      prefix = '-ms-';
    } else {
      styles = window.getComputedStyle(docElement, '');
      prefix = ([].slice
                .call(styles)
                .join('')
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['-o-'])
               )[0];
    }

    ModernizrProto._prefix = prefix;
    prefixes.push(prefix);
  }

  // expose these for the plugin API. Look in the source for how to join() them against your input
  ModernizrProto._prefixes = prefixes;

  return prefixes;
});
