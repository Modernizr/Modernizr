
// dev.opera.com/articles/view/css3-object-fit-object-position/

Modernizr.testStyles( '#modernizr{object-fit:cover}', function( elem ) {
	var style = window.getComputedStyle ?
		window.getComputedStyle( elem, null )
		: elem.currentStyle;
		
	Modernizr.addTest( 'objectfitcover', style.objectFit == 'cover' );
});