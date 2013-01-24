// Latest revision of WebSockets (Candidate Recommendation - http://www.w3.org/TR/2012/CR-websockets-20120920/)
// adds a "CLOSING" state which allows us to detect unprefixed and old version in Safari 5.1

Modernizr.addTest('websockets', function() {
	return 'WebSocket' in window && window.WebSocket.CLOSING === 2;
});
