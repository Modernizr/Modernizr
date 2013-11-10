/*!
{
  "name": "UserMedia",
  "property": "UserMedia",
  "tags": ["storage"],
  "authors": ["micole"]
}
!*/
/* DOC

Detects if the browser is compatable with UserMedia.
Based on http://www.webrtc.org/demo

*/
define(['Modernizr'], function( Modernizr ){

	Modernizr.addTest('usermedia', function (){
		if(navigator.mozGetUserMedia || navigator.webkitGetUserMedia){
			return true;
		} else {
			return false;
		}
	});
});