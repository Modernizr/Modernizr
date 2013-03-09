define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {
    // http://www.w3.org/TR/css3-exclusions
    // Examples: http://html.adobe.com/webstandards/cssexclusions
    // Separate test for `wrap-flow` property as IE10 has just implemented this alone
    Modernizr.addTest('wrapflow', testAllProps('wrapFlow', 'start'));
});
