
// FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10
// will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.
// FF10 still uses prefixes, so check for it until then.
// for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/

Modernizr.addTest('websockets', function() {
	return 'WebSocket' in window || 'MozWebSocket' in window;
});
