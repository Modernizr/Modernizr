define(['ModernizrProto', 'testProps', 'is'], function( ModernizrProto, testProps, is ) {
  // Modernizr.testProp() investigates whether a given style property is recognized
  // Note that the property names must be provided in the camelCase variant.
  // Modernizr.testProp('pointerEvents')
  // Also accepts optional 2nd arg, of a value to use for native feature detection, e.g.:
  // Modernizr.testProp('pointerEvents', 'none')
  var testProp = ModernizrProto.testProp = function( prop, value ) {
    return testProps([prop], undefined, is(value, 'undefined') ? undefined : [value]);
  };
  return testProp;
});
