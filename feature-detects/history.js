
// Test for the history API
// http://dev.w3.org/html5/spec/history.html#the-history-interface
// by Hay Kranen < http://github.com/hay > with suggestions by aFarkas

Modernizr.addTest('history', function() {
    // Issue #733
    // The stock browser on Android 2.2 & 2.3 returns positive on history support
    // Unfortunately support is really buggy and there is no clean way to detect
    // these bugs, so we fall back to a user agent sniff :(
    var ua = navigator.userAgent;

    // We only want Android 2, stock browser, and not Chrome which identifies
    // itself as 'Mobile Safari' as well
    if (ua.indexOf('Android 2') !== -1 &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1) {
        return false;
    } else {
        // Return the regular check
        return (window.history && 'pushState' in history);
    }
});