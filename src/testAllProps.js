define(['ModernizrProto', 'testPropsAll'], function( ModernizrProto, testPropsAll ) {
  /**
   * testAllProps determines whether a given CSS property, in some prefixed
   * form, is supported by the browser. It can optionally be given a value; in
   * which case testAllProps will only return true if the browser supports that
   * value for the named property; this latter case will use native detection
   * (via window.CSS.supports) if available.
   *
   * @param prop - String naming the property to test
   * @param value - [optional] String of the value to test
   * @param options - [optional] Options hash:-
   *            useValue:     Boolean; whether to test for value validity when not
   *                          using native detection; setting to false improves
   *                          performance, but can lead to inconsistencies between
   *                          native/non-native detection (default:true)
   *
   *            prefixValue:  Whether or not to test prefixed variants of values,
   *                          if supplied (default:false)
   */
    function testAllProps (prop, value, options) {
        return testPropsAll(prop, undefined, undefined, value, options);
    }
    ModernizrProto.testAllProps = testAllProps;
    return testAllProps;
});
