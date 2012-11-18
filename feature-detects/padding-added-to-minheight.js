// Detects if the browser is wrongly adding padding to min-height
// by Volker Rose | @riddla
// http://volker-rose.de/blog/box-sizing-and-min-height-css-trouble-within-firefox/
// http://jsfiddle.net/riddla/4bP73/
Modernizr.testStyles('#modernizr { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; min-height: 100px; padding-top: 10px; position: absolute; top: -2000em; }', function(elem, rule){
	Modernizr.addTest('padding-added-to-minheight', elem.scrollHeight === 110);
});