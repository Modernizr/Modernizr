// display: table and table-cell test. (both are tested under one name "table-cell" )
// By @scottjehl
Modernizr.addTest( "display-table",function(){
	var doc		= window.document,
		docElem	= doc.documentElement,		
		create	= function( el ){
			return doc.createElement( el );
		},
		parent	= create( "div" ),
		child	= create( "div" ),
		childb	= create( "div" ),
		ret;
			
	parent.style.display = "table";
	child.style.display = childb.style.display = "table-cell";
	child.style.padding = childb.style.padding = "10px";
		
	parent.appendChild( child );
	parent.appendChild( childb );
	docElem.insertBefore( parent, docElem.firstChild );
	
	ret = child.offsetLeft < childb.offsetLeft;
	docElem.removeChild(parent);
	return ret;	
});