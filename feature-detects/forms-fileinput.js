// Detects whether input type="file" is available on the platform
// E.g. iOS < 6 and some android version don't support this

Modernizr.addTest('fileinput', function() {
    var elem = document.createElement('input');
    elem.type = 'file';
    return !elem.disabled;
});
