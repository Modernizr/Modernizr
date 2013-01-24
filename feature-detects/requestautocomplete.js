// requestAutocomplete
// Detection of interactive autocomplete via HTMLFormElement#requestAutocomplete().
// Currently this will probably only be implemented in Chrome and is specific to payments.
// http://lists.whatwg.org/htdig.cgi/whatwg-whatwg.org/2012-October/037711.html,
// https://bugs.webkit.org/show_bug.cgi?id=100560

Modernizr.addTest('rac', !!Modernizr.prefixed('requestAutocomplete', document.createElement('form')));
