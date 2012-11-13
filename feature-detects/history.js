
// Test for the history API
// http://dev.w3.org/html5/spec/history.html#the-history-interface
// by Hay Kranen < http://github.com/hay >

Modernizr.addTest('history', function() {
    // Issue #733
    // The stock browser on Android < 3.0 returns positive on history support
    // Unfortunately support is really buggy and there is no clean way to detect
    // these bugs, so we fall back to a user agent sniff :(
    var ua = navigator.userAgent;
    var properCheck = !!(window.history && history.pushState);

    if (ua.indexOf("Android") === -1) {
        // No Android, simply return the 'proper' check
        return properCheck;
    } else {
        // We need to check for the stock browser (which identifies itself
        // as 'Mobile Safari'), however, Chrome on Android gives the same
        // identifier (and does support history properly), so check for that too
        if (ua.indexOf("Mobile Safari") !== -1 && ua.indexOf("Chrome") === -1) {
            // Buggy implementation, always return false
            return false;
        } else {
            // Chrome, return the proper check
            return properCheck;
        }
    }
});