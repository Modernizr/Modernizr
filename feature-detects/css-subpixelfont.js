/*
 * Test for SubPixel Font Rendering
 * (to infer if GDI or DirectWrite is used on Windows)
 * Authors: @derSchepp, @gerritvanaaken, @rodneyrehm, @yatil
 * Web: https://github.com/gerritvanaaken/subpixeldetect
 */

Modernizr.addTest('subpixelfont',  function() {
	var container = document.createElement('div'),
		inner = document.createElement('div'),
		width, hasSubpixelFontRendering;

	// style and content
	container.style.cssText = 'position: absolute; top: -10em; visibility:hidden; font: normal 10px arial;';
	inner.style.cssText = 'float: left; font-size: 33.3333%;';
	inner.textContent = 'This is a text written in Arial';

	// add test <div>s to the DOM
	container.appendChild(inner);
	document.body.appendChild(container);

	// get actual width of text
	width = window.getComputedStyle 
		? window.getComputedStyle(inner,null).getPropertyValue("width") 
		: '44px',

	// map this to modernizr or something
	hasSubpixelFontRendering = width !== '44px';

	// clean up
	container.parentNode.removeChild(container);

	return hasSubpixelFontRendering;
});
