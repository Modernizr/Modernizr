define(['ModernizrProto', 'testPropsAll'], function( ModernizrProto, testPropsAll ) {
  /**
   * testAllProps determines whether a given CSS property, in some prefixed
   * form, is supported by the browser. It can optionally be given a value; in
   * which case testAllProps will only return true if the browser supports that
   * value for the named property; this latter case will use native detection
   * (via window.CSS.supports) if available. A boolean can be passed as a 3rd
   * parameter to
   *
   * @param prop - String naming the property to test
   * @param value - [optional] String of the value to test
   * @param useValue - [optional] Whether to test that the value is valid when
   *                   using non-native detection (default: true)
   */
    function testAllProps (prop, value, useValue) {
        return testPropsAll(prop, undefined, undefined, value, useValue);
    }
    ModernizrProto.testAllProps = testAllProps;
    return testAllProps;
});
