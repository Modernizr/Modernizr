
// FF3.0 will false positive on this test
Modernizr.addTest('textshadow', function() {
    return document.createElement('div').style.textShadow === '';
});
