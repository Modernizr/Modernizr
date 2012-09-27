
// css-tricks.com/rgba-browser-support/

Modernizr.addTest('rgba', function() {


  var elem = document.createElement('div');
  var style = elem.style;
  style.cssText = 'background-color:rgba(150,255,150,.5)';

	return ('' + style.backgroundColor).indexOf('rgba') > -1;
});
