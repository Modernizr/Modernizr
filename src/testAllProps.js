define(['ModernizrProto', 'testPropsAll'], function( ModernizrProto, testPropsAll ) {
    function testAllProps (prop, value) {
        return testPropsAll(prop, undefined, undefined, value);
    }
    ModernizrProto.testAllProps = testAllProps;
    return testAllProps;
});
