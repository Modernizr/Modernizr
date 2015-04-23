define(['ModernizrProto', 'testProps'], function(ModernizrProto, testProps) {
  // Modernizr.testProp() investigates whether a given style property is recognized
  // Property names can be provided in either camelCase or kebab-case.
  // Modernizr.testProp('pointerEvents')
  // Also accepts optional 2nd arg, of a value to use for native feature detection, e.g.:
  // Modernizr.testProp('pointerEvents', 'none')
  var testProp = ModernizrProto.testProp = function(prop, value, useValue) {
    return testProps([prop], undefined, value, useValue);
  };
  return testProp;
});
