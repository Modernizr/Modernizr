// By @mathias, based on http://mths.be/axh
Modernizr.addTest('details', function() {
    var doc = document,
        el = doc.createElement('details');
    //test fast API implementation
    if( !('open' in el) ){
        return false;
    }
    //interface implemented, detected UI implementation
    var de = doc.documentElement,
        fake,
        root = doc.body || (function() {
            fake = true;
            return de.insertBefore(doc.createElement('body'), de.firstElementChild || de.firstChild);
        }()),
        diff;
    el.innerHTML = '<summary>a</summary>b';
    el.style.display = 'block';
    root.appendChild(el);
    diff = el.offsetHeight;
    el.open = true;
    diff = diff != el.offsetHeight;
    root.removeChild(el);
    fake && root.parentNode.removeChild(root);
    return diff;
});