// nth-child pseudo selector
Modernizr.addTest('nthchild', function(){

    return Modernizr.testStyles('#modernizr div {width:1px} #modernizr div:nth-child(2n) {width:2px;}', function (elem) {
        var elems = elem.getElementsByTagName('div'),
            test = true;

        for (var i=0; i<5; i++) {
            test = test && elems[i].offsetWidth == i%2+1;
        }
        
        return test;
    }, 5);

});
