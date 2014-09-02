define(['ModernizrProto', 'omPrefixes'], function( ModernizrProto, omPrefixes ) {
  var domPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(' ') : []);
  ModernizrProto._domPrefixes = domPrefixes;
  return domPrefixes;
});
