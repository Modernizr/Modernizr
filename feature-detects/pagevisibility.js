/**
 * test for the PageVisibility API
 * 
 * Tests for the presence of PageVisibility by looking for the document.hidden
 * attribute (or one of its prefixed versions)
 */
Modernizr.addTest('pagevisibility', function () {
    return (typeof document.hidden != "undefined" || typeof document.webkitHidden != "undefined" || 
    		typeof document.msHidden != "undefined" || typeof document.mozHidden != "undefined" ||
    		typeof document.oHidden != "undefined");
});
