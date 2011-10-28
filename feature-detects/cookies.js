
// cookies?
// both delicious and useful.

(function(){

// FIXME: we could do this with less code.
function createCookie(name,value) {
	document.cookie = name+"="+value+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}


var random = '' + Math.round(Math.random() * 1e8);
createCookie('Modernizr', random);
Modernizr.cookies = readCookie('Modernizr') == random;
eraseCookie('Modernizr');

})();
