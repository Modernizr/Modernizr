// 'first-child' pseudo-selector test.

Modernizr.addTest('firstchild', function() {
    return Modernizr.testStyles("#modernizr div {width:100px} #modernizr :first-child {width:200px;display:block}", function(elem) {
        return elem.firstChild.offsetWidth > elem.lastChild.offsetWidth;
    }, 2);
});
