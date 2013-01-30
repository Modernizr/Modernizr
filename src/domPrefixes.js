define(['ModernizrProto', 'omPrefixes'], function( ModernizrProto, omPrefixes ) {
  var domPrefixes = omPrefixes.toLowerCase().split(' ');
  ModernizrProto._domPrefixes = domPrefixes;
  return domPrefixes;
});
