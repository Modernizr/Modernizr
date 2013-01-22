define(['ModernizrProto', 'omPrefixes'], function( ModernizrProto, omPrefixes ) {
  var cssomPrefixes = omPrefixes.split(' ');
  ModernizrProto._cssomPrefixes = cssomPrefixes;
  return cssomPrefixes;
});
