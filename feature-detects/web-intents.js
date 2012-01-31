// Tests for the ability to use Web Intents (http://webintents.org).
Modernizr.addTest('webintents', function() {
    return !!navigator.startActivity;
});
