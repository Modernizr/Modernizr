define(['ModernizrProto', 'testProps'], function( ModernizrProto, testProps ) {
  // Modernizr.testProp() investigates whether a given style property is recognized
  // Note that the property names must be provided in the camelCase variant.
  // Modernizr.testProp('pointerEvents')
  var testProp = ModernizrProto.testProp = function( prop ) {
    return testProps([prop]);
  };
  return testProp;
});
