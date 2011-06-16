// :last-child pseudo selector test.
// By @laustdeleuran and @emilchristensen
// Please see http://reference.sitepoint.com/css/pseudoclass-lastchild for weird :last-child behaviour in FireFox below 2.0 and Safari below 2.0.
// Original Modernizr test here: http://jsfiddle.net/laustdeleuran/3rEVe/ and Pure JS here: http://jsfiddle.net/laustdeleuran/hvZ3J/
Modernizr.addTest('lastchild', function () {
    var hasLastChild,
        rules = ['#modernizr-last-child li{display:block;width:100px;height:100px;}','#modernizr-last-child li:last-child{width:200px;}'],
        head = document.getElementsByTagName('head')[0] || (function () {
            return document.documentElement.appendChild(document.createElement('head'));
        }()),
        root = document.body || (function () {
            return document.documentElement.appendChild(document.createElement('body'));
        }()),
        list = document.createElement('ul'),
        firstChild = document.createElement('li'),
        lastChild = document.createElement('li'),
        style = document.createElement('style');
        
    style.type = "text/css";
    if(style.styleSheet){ style.styleSheet.cssText = rules.join(''); } 
    else {style.appendChild(document.createTextNode(rules.join(''))); }
    head.appendChild(style);
    
    list.id = "modernizr-last-child";
    list.appendChild(firstChild);
    list.appendChild(lastChild);
    root.appendChild(list);
    hasLastChild = lastChild.offsetWidth > firstChild.offsetWidth;
    
    head.removeChild(style);
    root.removeChild(list);
    
    return hasLastChild;
});