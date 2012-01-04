// MathML
// Details: http://www.w3.org/Math/ 

Modernizr.addTest('mathml', function(){
	var hasMathML = false;
	if ( document.createElementNS ) {
	var ns = "http://www.w3.org/1998/Math/MathML",
	    div = document.createElement("div");
	    div.style.position = "absolute"; 
	var mfrac = div.appendChild(document.createElementNS(_namespace,"math"))
	               .appendChild(document.createElementNS(_namespace,"mfrac"));
	mfrac.appendChild(document.createElementNS(_namespace,"mi"))
	     .appendChild(document.createTextNode("xx"));
	mfrac.appendChild(document.createElementNS(_namespace,"mi"))
	     .appendChild(document.createTextNode("yy"));
	document.body.appendChild(div);
	hasMathML = div.offsetHeight > div.offsetWidth;
	}
	return hasMathML;
});