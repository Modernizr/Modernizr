/*global Autolinker, _, describe, beforeEach, afterEach, it, expect */
describe( "Autolinker", function() {
	
	describe( "instantiating and using as a class", function() {
		
		it( "should configure the instance with configuration options, and then be able to execute the link() method", function() {
			var autolinker = new Autolinker( { newWindow: false, truncate: 25 } );
		
			var result = autolinker.link( "Check out http://www.yahoo.com/some/long/path/to/a/file" );
			expect( result ).toBe( 'Check out <a href="http://www.yahoo.com/some/long/path/to/a/file">yahoo.com/some/long/pat..</a>' );
		} );
		
	} );
	
	
	describe( "link() method", function() {
		var autolinker;
		
		beforeEach( function() {
			autolinker = new Autolinker( { newWindow: false } );  // so that target="_blank" is not added to resulting autolinked URLs
		} );
		
		
		describe( "URL linking", function() {
			
			describe( "protocol-prefixed URLs (i.e. URLs starting with http:// or https://)", function() {
		
				it( "should automatically link URLs in the form of http://yahoo.com", function() {
					var result = autolinker.link( "Joe went to http://yahoo.com" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com">yahoo.com</a>' );
				} );
				
				
				it( "should automatically link localhost URLs when there is a protocol", function() {
					var result = autolinker.link( "Joe went to http://localhost today" );
					expect( result ).toBe( 'Joe went to <a href="http://localhost">localhost</a> today' );
				} );
				
				
				it( "should automatically link localhost URLs when there is a protocol and port", function() {
					var result = autolinker.link( "Joe went to http://localhost:8000 today" );
					expect( result ).toBe( 'Joe went to <a href="http://localhost:8000">localhost:8000</a> today' );
				} );
				
				
				it( "should automatically link localhost URLs when there is a protocol, port, and path", function() {
					var result = autolinker.link( "Joe went to http://localhost:8000/abc today" );
					expect( result ).toBe( 'Joe went to <a href="http://localhost:8000/abc">localhost:8000/abc</a> today' );
				} );
				
				
				it( "should automatically link localhost URLs when there is a protocol, port, and query string", function() {
					var result = autolinker.link( "Joe went to http://localhost:8000?abc today" );
					expect( result ).toBe( 'Joe went to <a href="http://localhost:8000?abc">localhost:8000?abc</a> today' );
				} );
				
				
				it( "should automatically link localhost URLs when there is a protocol, port, and hash", function() {
					var result = autolinker.link( "Joe went to http://localhost:8000#abc today" );
					expect( result ).toBe( 'Joe went to <a href="http://localhost:8000#abc">localhost:8000#abc</a> today' );
				} );
				
				
				it( "should not include the '?' char if it is at the end of the URL", function() {
					var result = autolinker.link( "Joe went to http://localhost:8000? today" );
					expect( result ).toBe( 'Joe went to <a href="http://localhost:8000">localhost:8000</a>? today' );
				} );
			
			
				it( "should automatically link URLs in the form of http://www.yahoo.com (i.e. protocol and 'www' prefix)", function() {
					var result = autolinker.link( "Joe went to http://www.yahoo.com" );
					expect( result ).toBe( 'Joe went to <a href="http://www.yahoo.com">yahoo.com</a>' );
				} );
			
			
				it( "should automatically link https URLs in the form of https://yahoo.com", function() {
					var result = autolinker.link( "Joe went to https://www.yahoo.com" );
					expect( result ).toBe( 'Joe went to <a href="https://www.yahoo.com">yahoo.com</a>' );
				} );
				
				
				it( "should automatically link capitalized URLs", function() {
					var result = autolinker.link( "Joe went to HTTP://WWW.YAHOO.COM" );
					expect( result ).toBe( 'Joe went to <a href="HTTP://WWW.YAHOO.COM">YAHOO.COM</a>' );
				} );
				
				
				it( "should automatically link 'yahoo.xyz' (a known TLD), but not 'sencha.etc' (an unknown TLD)", function() {
					var result = autolinker.link( "yahoo.xyz should be linked, sencha.etc should not", { newWindow: false } );
					expect( result ).toBe( '<a href="http://yahoo.xyz">yahoo.xyz</a> should be linked, sencha.etc should not' );
				} );
				
				
				it( "should automatically link 'a.museum' (a known TLD), but not 'abc.123'", function() {
					var result = autolinker.link( "a.museum should be linked, but abc.123 should not", { newWindow: false } );
					expect( result ).toBe( '<a href="http://a.museum">a.museum</a> should be linked, but abc.123 should not' );
				} );
		
		
				it( "should automatically link URLs in the form of 'http://yahoo.com.', without including the trailing period", function() {
					var result = autolinker.link( "Joe went to http://yahoo.com." );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com">yahoo.com</a>.' );
				} );
				
				
				it( "should automatically link URLs with a port number", function() {
					var result = autolinker.link( "Joe went to http://yahoo.com:8000 today." );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com:8000">yahoo.com:8000</a> today.' );
				} );
				
				
				it( "should automatically link URLs with a port number and a following slash", function() {
					var result = autolinker.link( "Joe went to http://yahoo.com:8000/ today." );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com:8000/">yahoo.com:8000</a> today.' );
				} );
				
				
				it( "should automatically link URLs with a port number and a path", function() {
					var result = autolinker.link( "Joe went to http://yahoo.com:8000/mysite/page today." );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com:8000/mysite/page">yahoo.com:8000/mysite/page</a> today.' );
				} );
				
				
				it( "should automatically link a localhost URL with a port number and a path", function() {
					var result = autolinker.link( "Joe went to http://localhost:8000/page today." );
					expect( result ).toBe( 'Joe went to <a href="http://localhost:8000/page">localhost:8000/page</a> today.' );
				} );
				
				
				it( "should automatically link URLs with a port number and a query string", function() {
					var result = autolinker.link( "Joe went to http://yahoo.com:8000?page=index today." );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com:8000?page=index">yahoo.com:8000?page=index</a> today.' );
				} );
				
				
				it( "should automatically link a localhost URL with a port number and a query string", function() {
					var result = autolinker.link( "Joe went to http://localhost:8000?page=index today." );
					expect( result ).toBe( 'Joe went to <a href="http://localhost:8000?page=index">localhost:8000?page=index</a> today.' );
				} );
				
				
				it( "should automatically link URLs with a port number and a hash string", function() {
					var result = autolinker.link( "Joe went to http://yahoo.com:8000#page=index today." );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com:8000#page=index">yahoo.com:8000#page=index</a> today.' );
				} );
				
				
				it( "should automatically link a localhost URL with a port number and a hash string", function() {
					var result = autolinker.link( "Joe went to http://localhost:8000#page=index today." );
					expect( result ).toBe( 'Joe went to <a href="http://localhost:8000#page=index">localhost:8000#page=index</a> today.' );
				} );
				
				
				describe( "protocol linking", function() {
	
					it( "should NOT include preceding ':' introductions without a space", function() {
						var result = autolinker.link( 'the link:http://example.com/' );
						expect( result ).toBe( 'the link:<a href="http://example.com/">example.com</a>' );
					} );
					
					
					it( "should autolink protocols with at least two characters", function() {
						var result = autolinker.link( 'link this: gg://example.com/' );
						expect( result ).toBe( 'link this: <a href="gg://example.com/">gg://example.com</a>' );
					} );
					
					
					it( "should autolink protocols with more than 9 characters (as was the previous upper bound, but it seems protocols may be longer)", function() {
						var result = autolinker.link( 'link this: opaquelocktoken://example' );
						expect( result ).toBe( 'link this: <a href="opaquelocktoken://example">opaquelocktoken://example</a>' );
					} );
					
					
					it( "should NOT autolink a protocol with only one character", function() {
						var result = autolinker.link( 'do not link this: a://example' );
						expect( result ).toBe( 'do not link this: a://example' );
					} );
					
					
					it( "should autolink protocols with digits, dashes, dots, and plus signs in their names", function() {
						var result1 = autolinker.link( 'link this: a1://example' );
						expect( result1 ).toBe( 'link this: <a href="a1://example">a1://example</a>' );
						
						var result2 = autolinker.link( 'link this: view-source://example' );
						expect( result2 ).toBe( 'link this: <a href="view-source://example">view-source://example</a>' );
						
						var result3 = autolinker.link( 'link this: iris.xpc://example' );
						expect( result3 ).toBe( 'link this: <a href="iris.xpc://example">iris.xpc://example</a>' );
						
						var result4 = autolinker.link( 'link this: test+protocol://example' );
						expect( result4 ).toBe( 'link this: <a href="test+protocol://example">test+protocol://example</a>' );
						
						// Test all allowed non-alpha chars
						var result5 = autolinker.link( 'link this: test+proto-col.123://example' );
						expect( result5 ).toBe( 'link this: <a href="test+proto-col.123://example">test+proto-col.123://example</a>' );
					} );
					
					
					it( "should NOT autolink protocols that start with a digit, dash, plus sign, or dot, as per http://tools.ietf.org/html/rfc3986#section-3.1", function() {
						var result = autolinker.link( 'do not link this: 1a://example' );
						expect( result ).toBe( 'do not link this: 1a://example' );
						
						var result2 = autolinker.link( 'do not link this: -a://example' );
						expect( result2 ).toBe( 'do not link this: -a://example' );
						
						var result3 = autolinker.link( 'do not link this: +a://example' );
						expect( result3 ).toBe( 'do not link this: +a://example' );
						
						var result4 = autolinker.link( 'do not link this: .a://example' );
						expect( result4 ).toBe( 'do not link this: .a://example' );
					} );


                    it( "should NOT autolink possible URLs with the 'javascript:' URI scheme", function() {
                        var result = autolinker.link( "do not link javascript:window.alert('hi') please" );
                        expect( result ).toBe( "do not link javascript:window.alert('hi') please" );
                    } );


                    it( "should NOT autolink possible URLs with the 'javascript:' URI scheme, with different upper/lowercase letters in the uri scheme", function() {
                        var result = autolinker.link( "do not link JavAscriPt:window.alert('hi') please" );
                        expect( result ).toBe( "do not link JavAscriPt:window.alert('hi') please" );
                    } );


                    it( "should NOT autolink possible URLs with the 'vbscript:' URI scheme", function() {
                        var result = autolinker.link( "do not link vbscript:window.alert('hi') please" );
                        expect( result ).toBe( "do not link vbscript:window.alert('hi') please" );
                    } );


                    it( "should NOT autolink possible URLs with the 'vbscript:' URI scheme, with different upper/lowercase letters in the uri scheme", function() {
                        var result = autolinker.link( "do not link vBsCriPt:window.alert('hi') please" );
                        expect( result ).toBe( "do not link vBsCriPt:window.alert('hi') please" );
                    } );
					
					
					it( "should NOT automatically link strings of the form 'git:d' (using the heuristic that the domain name does not have a '.' in it)", function() {
						var result = autolinker.link( 'Something like git:d should not be linked as a URL' );
						expect( result ).toBe( 'Something like git:d should not be linked as a URL' );
					} );
					
					
					it( "should NOT automatically link strings of the form 'git:domain' (using the heuristic that the domain name does not have a '.' in it)", function() {
						var result = autolinker.link( 'Something like git:domain should not be linked as a URL' );
						expect( result ).toBe( 'Something like git:domain should not be linked as a URL' );
					} );
					
					
					it( "should automatically link strings of the form 'git:domain.com', interpreting this as a protocol and domain name", function() {
						var result = autolinker.link( 'Something like git:domain.com should be linked as a URL' );
						expect( result ).toBe( 'Something like <a href="git:domain.com">git:domain.com</a> should be linked as a URL' );
					} );
					
					
					it( "should NOT automatically link a string in the form of 'version:1.0'", function() {
						var result = autolinker.link( 'version:1.0' );
						expect( result ).toBe( 'version:1.0' );
					} );
					
					
					it( "should NOT automatically link these 'abc:def' style strings", function() {
						var strings = [
							'BEGIN:VCALENDAR',
							'VERSION:1.0',
							'BEGIN:VEVENT',
							'DTSTART:20140401T090000',
							'DTEND:20140401T100000',
							'SUMMARY:Some thing to do',
							'LOCATION:',
							'DESCRIPTION:Just call this guy yeah! Testings',
							'PRIORITY:3',
							'END:VEVENT',
							'END:VCALENDAR',
							'START:123',
							'START:123:SOMETHING'
						];
						var i, len = strings.length, str;
						
						// Test with just the strings themselves.
						for( i = 0; i < len; i++ ) {
							str = strings[ i ];
							expect( autolinker.link( str ) ).toBe( str );  // none should be autolinked
						}
						
						// Test with the strings surrounded by other text
						for( i = 0; i < len; i++ ) {
							str = strings[ i ];
							expect( autolinker.link( 'test ' + str + ' test' ) ).toBe( 'test ' + str + ' test' );  // none should be autolinked 
						}
					} );
					
				} );
					
			} );
			
			
			describe( "'www.' prefixed URLs", function() {
		
				it( "should automatically link URLs in the form of www.yahoo.com, prepending the http:// in this case", function() {
					var result = autolinker.link( "Joe went to www.yahoo.com" );
					expect( result ).toBe( 'Joe went to <a href="http://www.yahoo.com">yahoo.com</a>' );
				} );
				
				
				it( "should automatically link URLs in the form of 'www.yahoo.com.', without including the trailing period", function() {
					var result = autolinker.link( "Joe went to www.yahoo.com." );
					expect( result ).toBe( 'Joe went to <a href="http://www.yahoo.com">yahoo.com</a>.' );
				} );
				
				
				it( "should automatically link URLs in the form of 'www.yahoo.com:8000' (with a port number)", function() {
					var result = autolinker.link( "Joe went to www.yahoo.com:8000 today" );
					expect( result ).toBe( 'Joe went to <a href="http://www.yahoo.com:8000">yahoo.com:8000</a> today' );
				} );
				
				
				it( "should automatically link URLs in the form of 'www.yahoo.com:8000/abc' (with a port number and path)", function() {
					var result = autolinker.link( "Joe went to www.yahoo.com:8000/abc today" );
					expect( result ).toBe( 'Joe went to <a href="http://www.yahoo.com:8000/abc">yahoo.com:8000/abc</a> today' );
				} );
				
				
				it( "should automatically link URLs in the form of 'www.yahoo.com:8000?abc' (with a port number and query string)", function() {
					var result = autolinker.link( "Joe went to www.yahoo.com:8000?abc today" );
					expect( result ).toBe( 'Joe went to <a href="http://www.yahoo.com:8000?abc">yahoo.com:8000?abc</a> today' );
				} );
				
				
				it( "should automatically link URLs in the form of 'www.yahoo.com:8000#abc' (with a port number and hash)", function() {
					var result = autolinker.link( "Joe went to www.yahoo.com:8000#abc today" );
					expect( result ).toBe( 'Joe went to <a href="http://www.yahoo.com:8000#abc">yahoo.com:8000#abc</a> today' );
				} );
				
				
				it( "should automatically link capitalized URLs", function() {
					var result = autolinker.link( "Joe went to WWW.YAHOO.COM today" );
					expect( result ).toBe( 'Joe went to <a href="http://WWW.YAHOO.COM">YAHOO.COM</a> today' );
				} );
				
				
				it( "should not include the '?' char if it is at the end of the URL", function() {
					var result = autolinker.link( "Joe went to www.yahoo.com? today" );
					expect( result ).toBe( 'Joe went to <a href="http://www.yahoo.com">yahoo.com</a>? today' );
				} );
				
			} );
		
			
			describe( "URLs with no protocol prefix, and no 'www' (i.e. URLs with known TLDs)", function() {
		
				it( "should automatically link URLs in the form of yahoo.com, prepending the http:// in this case", function() {
					var result = autolinker.link( "Joe went to yahoo.com" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com">yahoo.com</a>' );
				} );
		
				
				it( "should automatically link URLs in the form of subdomain.yahoo.com", function() {
					var result = autolinker.link( "Joe went to subdomain.yahoo.com" );
					expect( result ).toBe( 'Joe went to <a href="http://subdomain.yahoo.com">subdomain.yahoo.com</a>' );
				} );

				
				it( "should automatically link URLs in the form of yahoo.co.uk, prepending the http:// in this case", function() {
					var result = autolinker.link( "Joe went to yahoo.co.uk" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.co.uk">yahoo.co.uk</a>' );
				} );
		
		
				it( "should automatically link URLs in the form of yahoo.ru, prepending the http:// in this case", function() {
					var result = autolinker.link( "Joe went to yahoo.ru" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.ru">yahoo.ru</a>' );
				} );
		
		
				it( "should automatically link URLs in the form of 'yahoo.com.', without including the trailing period", function() {
					var result = autolinker.link( "Joe went to yahoo.com." );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com">yahoo.com</a>.' );
				} );
				
				
				it( "should automatically link URLs in the form of 'yahoo.com:8000' (with a port number)", function() {
					var result = autolinker.link( "Joe went to yahoo.com:8000 today" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com:8000">yahoo.com:8000</a> today' );
				} );
				
				
				it( "should automatically link URLs in the form of 'yahoo.com:8000/abc' (with a port number and path)", function() {
					var result = autolinker.link( "Joe went to yahoo.com:8000/abc today" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com:8000/abc">yahoo.com:8000/abc</a> today' );
				} );
				
				
				it( "should automatically link URLs in the form of 'yahoo.com:8000?abc' (with a port number and query string)", function() {
					var result = autolinker.link( "Joe went to yahoo.com:8000?abc today" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com:8000?abc">yahoo.com:8000?abc</a> today' );
				} );
				
				
				it( "should automatically link URLs in the form of 'yahoo.com:8000#abc' (with a port number and hash)", function() {
					var result = autolinker.link( "Joe went to yahoo.com:8000#abc today" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com:8000#abc">yahoo.com:8000#abc</a> today' );
				} );
				
				
				it( "should automatically link capitalized URLs", function() {
					var result = autolinker.link( "Joe went to YAHOO.COM." );
					expect( result ).toBe( 'Joe went to <a href="http://YAHOO.COM">YAHOO.COM</a>.' );
				} );
				
				
				it( "should not include the '?' char if it is at the end of the URL", function() {
					var result = autolinker.link( "Joe went to yahoo.com? today" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com">yahoo.com</a>? today' );
				} );
				
			} );
		
		
			describe( "protocol-relative URLs (i.e. URLs starting with only '//')", function() {
				
				it( "should automatically link protocol-relative URLs in the form of //yahoo.com at the beginning of the string", function() {
					var result = autolinker.link( "//yahoo.com" );
					expect( result ).toBe( '<a href="//yahoo.com">yahoo.com</a>' );
				} );
				
				
				it( "should automatically link protocol-relative URLs in the form of //yahoo.com in the middle of the string", function() {
					var result = autolinker.link( "Joe went to //yahoo.com yesterday" );
					expect( result ).toBe( 'Joe went to <a href="//yahoo.com">yahoo.com</a> yesterday' );
				} );
				
				
				it( "should automatically link protocol-relative URLs in the form of //yahoo.com at the end of the string", function() {
					var result = autolinker.link( "Joe went to //yahoo.com" );
					expect( result ).toBe( 'Joe went to <a href="//yahoo.com">yahoo.com</a>' );
				} );
				
				
				it( "should automatically link capitalized protocol-relative URLs", function() {
					var result = autolinker.link( "Joe went to //YAHOO.COM" );
					expect( result ).toBe( 'Joe went to <a href="//YAHOO.COM">YAHOO.COM</a>' );
				} );
				
				
				it( "should NOT automatically link supposed protocol-relative URLs in the form of abc//yahoo.com, which is most likely not supposed to be interpreted as a URL", function() {
					var result = autolinker.link( "Joe went to abc//yahoo.com" );
					expect( result ).toBe( 'Joe went to abc//yahoo.com' );
				} );
				
				
				it( "should NOT automatically link supposed protocol-relative URLs in the form of 123//yahoo.com, which is most likely not supposed to be interpreted as a URL", function() {
					var result = autolinker.link( "Joe went to 123//yahoo.com" );
					expect( result ).toBe( 'Joe went to 123//yahoo.com' );
				} );
				
				
				it( "should automatically link supposed protocol-relative URLs as long as the character before the '//' is a non-word character", function() {
					var result = autolinker.link( "Joe went to abc-//yahoo.com" );
					expect( result ).toBe( 'Joe went to abc-<a href="//yahoo.com">yahoo.com</a>' );
				} );
				
			} );
			
			
			describe( "parenthesis handling", function() {
			
				it( "should include parentheses in URLs", function() {
					var result = autolinker.link( "TLDs come from en.wikipedia.org/wiki/IANA_(disambiguation)." );
					expect( result ).toBe( 'TLDs come from <a href="http://en.wikipedia.org/wiki/IANA_(disambiguation)">en.wikipedia.org/wiki/IANA_(disambiguation)</a>.' );
					
					result = autolinker.link( "MSDN has a great article at http://msdn.microsoft.com/en-us/library/aa752574(VS.85).aspx." );
					expect( result ).toBe( 'MSDN has a great article at <a href="http://msdn.microsoft.com/en-us/library/aa752574(VS.85).aspx">msdn.microsoft.com/en-us/library/aa752574(VS.85).aspx</a>.' );
				} );
				
				
				it( "should include parentheses in URLs with query strings", function() {
					var result = autolinker.link( "TLDs come from en.wikipedia.org/wiki?IANA_(disambiguation)." );
					expect( result ).toBe( 'TLDs come from <a href="http://en.wikipedia.org/wiki?IANA_(disambiguation)">en.wikipedia.org/wiki?IANA_(disambiguation)</a>.' );
					
					result = autolinker.link( "MSDN has a great article at http://msdn.microsoft.com/en-us/library?aa752574(VS.85).aspx." );
					expect( result ).toBe( 'MSDN has a great article at <a href="http://msdn.microsoft.com/en-us/library?aa752574(VS.85).aspx">msdn.microsoft.com/en-us/library?aa752574(VS.85).aspx</a>.' );
				} );
				
				
				it( "should include parentheses in URLs with hash anchors", function() {
					var result = autolinker.link( "TLDs come from en.wikipedia.org/wiki#IANA_(disambiguation)." );
					expect( result ).toBe( 'TLDs come from <a href="http://en.wikipedia.org/wiki#IANA_(disambiguation)">en.wikipedia.org/wiki#IANA_(disambiguation)</a>.' );
					
					result = autolinker.link( "MSDN has a great article at http://msdn.microsoft.com/en-us/library#aa752574(VS.85).aspx." );
					expect( result ).toBe( 'MSDN has a great article at <a href="http://msdn.microsoft.com/en-us/library#aa752574(VS.85).aspx">msdn.microsoft.com/en-us/library#aa752574(VS.85).aspx</a>.' );
				} );
				
				
				it( "should include parentheses in URLs, when the URL is also in parenthesis itself", function() {
					var result = autolinker.link( "TLDs come from (en.wikipedia.org/wiki/IANA_(disambiguation))." );
					expect( result ).toBe( 'TLDs come from (<a href="http://en.wikipedia.org/wiki/IANA_(disambiguation)">en.wikipedia.org/wiki/IANA_(disambiguation)</a>).' );
					
					result = autolinker.link( "MSDN has a great article at (http://msdn.microsoft.com/en-us/library/aa752574(VS.85).aspx)." );
					expect( result ).toBe( 'MSDN has a great article at (<a href="http://msdn.microsoft.com/en-us/library/aa752574(VS.85).aspx">msdn.microsoft.com/en-us/library/aa752574(VS.85).aspx</a>).' );
				} );
				
				
				it( "should not include a final closing paren in the URL, if it doesn't match an opening paren in the url", function() {
					var result = autolinker.link( "Click here (google.com) for more details" );
					expect( result ).toBe( 'Click here (<a href="http://google.com">google.com</a>) for more details' );
				} );
				
				
				it( "should not include a final closing paren in the URL when a path exists", function() {
					var result = autolinker.link( "Click here (google.com/abc) for more details" );
					expect( result ).toBe( 'Click here (<a href="http://google.com/abc">google.com/abc</a>) for more details' );
				} );
				
				
				it( "should not include a final closing paren in the URL when a query string exists", function() {
					var result = autolinker.link( "Click here (google.com?abc=1) for more details" );
					expect( result ).toBe( 'Click here (<a href="http://google.com?abc=1">google.com?abc=1</a>) for more details' );
				} );
				
				
				it( "should not include a final closing paren in the URL when a hash anchor exists", function() {
					var result = autolinker.link( "Click here (google.com#abc) for more details" );
					expect( result ).toBe( 'Click here (<a href="http://google.com#abc">google.com#abc</a>) for more details' );
				} );
				
				
				it( "should include escaped parentheses in the URL", function() {
					var result = autolinker.link( "Here's an example from CodingHorror: http://en.wikipedia.org/wiki/PC_Tools_%28Central_Point_Software%29" );
					expect( result ).toBe( 'Here\'s an example from CodingHorror: <a href="http://en.wikipedia.org/wiki/PC_Tools_%28Central_Point_Software%29">en.wikipedia.org/wiki/PC_Tools_%28Central_Point_Software%29</a>' );
				} );
				
			} );
		
		
			describe( "Special character handling", function() {
			
				it( "should include $ in URLs", function() {
					var result = autolinker.link( "Check out pair programming: http://c2.com/cgi/wiki$?VirtualPairProgramming" );
					expect( result ).toBe( 'Check out pair programming: <a href="http://c2.com/cgi/wiki$?VirtualPairProgramming">c2.com/cgi/wiki$?VirtualPairProgramming</a>' );
				} );
				
				
				it( "should include $ in URLs with query strings", function() {
					var result = autolinker.link( "Check out the image at http://server.com/template?fmt=jpeg&$base=700." );
					expect( result ).toBe( 'Check out the image at <a href="http://server.com/template?fmt=jpeg&$base=700">server.com/template?fmt=jpeg&$base=700</a>.' );
				} );

				
				it( "should include * in URLs", function() {
					var result = autolinker.link( "Google from wayback http://wayback.archive.org/web/*/http://google.com" );
					expect( result ).toBe( 'Google from wayback <a href="http://wayback.archive.org/web/*/http://google.com">wayback.archive.org/web/*/http://google.com</a>' );
				} );
				
				
				it( "should include * in URLs with query strings", function() {
					var result = autolinker.link( "Twitter search for bob smith https://api.twitter.com/1.1/users/search.json?count=20&q=Bob+*+Smith" );
					expect( result ).toBe( 'Twitter search for bob smith <a href="https://api.twitter.com/1.1/users/search.json?count=20&q=Bob+*+Smith">api.twitter.com/1.1/users/search.json?count=20&q=Bob+*+Smith</a>' );
				} );

				
				it( "should include ' in URLs", function() {
					var result = autolinker.link( "You are a star http://en.wikipedia.org/wiki/You're_a_Star/" );
					expect( result ).toBe( 'You are a star <a href="http://en.wikipedia.org/wiki/You\'re_a_Star/">en.wikipedia.org/wiki/You\'re_a_Star</a>' );
				} );
				
				
				it( "should include ' in URLs with query strings", function() {
					var result = autolinker.link( "Test google search https://www.google.com/#q=test's" );
					expect( result ).toBe( 'Test google search <a href="https://www.google.com/#q=test\'s">google.com/#q=test\'s</a>' );
				} );
				
				
				it( "should include [ and ] in URLs with query strings", function() {
					var result = autolinker.link( "Go to https://example.com/api/export/873/?a[]=10&a[]=9&a[]=8&a[]=7&a[]=6 today" );
					expect( result ).toBe( 'Go to <a href="https://example.com/api/export/873/?a[]=10&a[]=9&a[]=8&a[]=7&a[]=6">example.com/api/export/873/?a[]=10&a[]=9&a[]=8&a[]=7&a[]=6</a> today' );
				} );

			} );
		
		
			describe( "URL path, query string, and hash handling", function() {
				
				it( "should automatically link URLs in the form of yahoo.com/path/to/file.html, handling the path", function() {
					var result = autolinker.link( "Joe went to yahoo.com/path/to/file.html" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com/path/to/file.html">yahoo.com/path/to/file.html</a>' );
				} );
				
				
				it( "should automatically link URLs in the form of yahoo.com?hi=1, handling the query string", function() {
					var result = autolinker.link( "Joe went to yahoo.com?hi=1" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com?hi=1">yahoo.com?hi=1</a>' );
				} );
				
				
				it( "should automatically link URLs in the form of yahoo.com#index1, handling the hash", function() {
					var result = autolinker.link( "Joe went to yahoo.com#index1" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com#index1">yahoo.com#index1</a>' );
				} );
				
				
				it( "should automatically link URLs in the form of yahoo.com/path/to/file.html?hi=1, handling the path and the query string", function() {
					var result = autolinker.link( "Joe went to yahoo.com/path/to/file.html?hi=1" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com/path/to/file.html?hi=1">yahoo.com/path/to/file.html?hi=1</a>' );
				} );
				
				
				it( "should automatically link URLs in the form of yahoo.com/path/to/file.html#index1, handling the path and the hash", function() {
					var result = autolinker.link( "Joe went to yahoo.com/path/to/file.html#index1" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com/path/to/file.html#index1">yahoo.com/path/to/file.html#index1</a>' );
				} );
				
				
				it( "should automatically link URLs in the form of yahoo.com/path/to/file.html?hi=1#index1, handling the path, query string, and hash", function() {
					var result = autolinker.link( "Joe went to yahoo.com/path/to/file.html?hi=1#index1" );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com/path/to/file.html?hi=1#index1">yahoo.com/path/to/file.html?hi=1#index1</a>' );
				} );
				
				
				it( "should automatically link a URL with a complex hash (such as a Google Analytics url)", function() {
					var result = autolinker.link( "Joe went to https://www.google.com/analytics/web/?pli=1#my-reports/Obif-Y6qQB2xAJk0ZZE1Zg/a4454143w36378534p43704543/%3F.date00%3D20120314%26_.date01%3D20120314%268534-table.rowStart%3D0%268534-table.rowCount%3D25/ and analyzed his analytics" );
					expect( result ).toBe( 'Joe went to <a href="https://www.google.com/analytics/web/?pli=1#my-reports/Obif-Y6qQB2xAJk0ZZE1Zg/a4454143w36378534p43704543/%3F.date00%3D20120314%26_.date01%3D20120314%268534-table.rowStart%3D0%268534-table.rowCount%3D25/">google.com/analytics/web/?pli=1#my-reports/Obif-Y6qQB2xAJk0ZZE1Zg/a4454143w36378534p43704543/%3F.date00%3D20120314%26_.date01%3D20120314%268534-table.rowStart%3D0%268534-table.rowCount%3D25</a> and analyzed his analytics' );
				} );
				
		
				it( "should automatically link URLs in the form of 'http://yahoo.com/sports.', without including the trailing period", function() {
					var result = autolinker.link( "Joe went to http://yahoo.com/sports." );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com/sports">yahoo.com/sports</a>.' );
				} );
				
				
				it( "should remove trailing slash from 'http://yahoo.com/'", function() {
					var result = autolinker.link( "Joe went to http://yahoo.com/." );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com/">yahoo.com</a>.' );
				} );
				
				
				it( "should remove trailing slash from 'http://yahoo.com/sports/'", function() {
					var result = autolinker.link( "Joe went to http://yahoo.com/sports/." );
					expect( result ).toBe( 'Joe went to <a href="http://yahoo.com/sports/">yahoo.com/sports</a>.' );
				} );
				
			} );
		
		
			it( "should automatically link multiple URLs in the same input string", function() {
				var result = autolinker.link( 'Joe went to http://yahoo.com and http://google.com' );
				expect( result ).toBe( 'Joe went to <a href="http://yahoo.com">yahoo.com</a> and <a href="http://google.com">google.com</a>' );
			} );
		
		} );
	
		
		describe( "email address linking", function() {
			
			it( "should automatically link an email address which is the only text in the string", function() {
				var result = autolinker.link( "joe@joe.com" );
				expect( result ).toBe( '<a href="mailto:joe@joe.com">joe@joe.com</a>' );
			} );
			
			
			it( "should automatically link email addresses at the start of the string", function() {
				var result = autolinker.link( "joe@joe.com is Joe's email" );
				expect( result ).toBe( '<a href="mailto:joe@joe.com">joe@joe.com</a> is Joe\'s email' );
			} );
		
		
			it( "should automatically link an email address in the middle of the string", function() {
				var result = autolinker.link( "Joe's email is joe@joe.com because it is" );
				expect( result ).toBe( 'Joe\'s email is <a href="mailto:joe@joe.com">joe@joe.com</a> because it is' );
			} );
			
			
			it( "should automatically link email addresses at the end of the string", function() {
				var result = autolinker.link( "Joe's email is joe@joe.com" );
				expect( result ).toBe( 'Joe\'s email is <a href="mailto:joe@joe.com">joe@joe.com</a>' );
			} );
			
			
			it( "should automatically link email addresses with a period in the 'local part'", function() {
				var result = autolinker.link( "Joe's email is joe.smith@joe.com" );
				expect( result ).toBe( 'Joe\'s email is <a href="mailto:joe.smith@joe.com">joe.smith@joe.com</a>' );
			} );
			
			
			it( "should automatically link fully-capitalized email addresses", function() {
				var result = autolinker.link( "Joe's email is JOE@JOE.COM" );
				expect( result ).toBe( 'Joe\'s email is <a href="mailto:JOE@JOE.COM">JOE@JOE.COM</a>' );
			} );
			
			
			it( "should properly link an email address in parenthesis", function() {
				var result = autolinker.link( "Joe's email is (joe@joe.com)" );
				expect( result ).toBe( 'Joe\'s email is (<a href="mailto:joe@joe.com">joe@joe.com</a>)' );
			} );
			
			
			it( "should NOT automatically link any old word with an @ character in it", function() {
				var result = autolinker.link( "Hi there@stuff" );
				expect( result ).toBe( 'Hi there@stuff' );
			} );
			
		} );
		
		
		describe( "twitter handle linking", function() {
			
			it( "should automatically link a twitter handle which is the only thing in the string", function() {
				var result = autolinker.link( "@joe_the_man12" );
				expect( result ).toBe( '<a href="https://twitter.com/joe_the_man12">@joe_the_man12</a>' );
			} );
			
			
			it( "should automatically link twitter handles at the beginning of a string", function() {
				var result = autolinker.link( "@greg is my twitter handle" );
				expect( result ).toBe( '<a href="https://twitter.com/greg">@greg</a> is my twitter handle' );
			} );
			
			
			it( "should automatically link twitter handles in the middle of a string", function() {
				var result = autolinker.link( "Joe's twitter is @joe_the_man12 today, but what will it be tomorrow?" );
				expect( result ).toBe( 'Joe\'s twitter is <a href="https://twitter.com/joe_the_man12">@joe_the_man12</a> today, but what will it be tomorrow?' );
			} );
			
			
			it( "should automatically link twitter handles at the end of a string", function() {
				var result = autolinker.link( "Joe's twitter is @joe_the_man12" );
				expect( result ).toBe( 'Joe\'s twitter is <a href="https://twitter.com/joe_the_man12">@joe_the_man12</a>' );
			} );
			
			
			it( "should automatically link twitter handles surrounded by parentheses", function() {
				var result = autolinker.link( "Joe's twitter is (@joe_the_man12)" );
				expect( result ).toBe( 'Joe\'s twitter is (<a href="https://twitter.com/joe_the_man12">@joe_the_man12</a>)' );
			} );
			
			
			it( "should automatically link twitter handles surrounded by braces", function() {
				var result = autolinker.link( "Joe's twitter is {@joe_the_man12}" );
				expect( result ).toBe( 'Joe\'s twitter is {<a href="https://twitter.com/joe_the_man12">@joe_the_man12</a>}' );
			} );
			
			
			it( "should automatically link twitter handles surrounded by brackets", function() {
				var result = autolinker.link( "Joe's twitter is [@joe_the_man12]" );
				expect( result ).toBe( 'Joe\'s twitter is [<a href="https://twitter.com/joe_the_man12">@joe_the_man12</a>]' );
			} );
			
			
			it( "should automatically link multiple twitter handles in a string", function() {
				var result = autolinker.link( "@greg is tweeting @joe with @josh" );
				expect( result ).toBe( '<a href="https://twitter.com/greg">@greg</a> is tweeting <a href="https://twitter.com/joe">@joe</a> with <a href="https://twitter.com/josh">@josh</a>' );
			} );
			
			
			it( "should automatically liny fully capitalized twitter handles", function() {
				var result = autolinker.link( "@GREG is tweeting @JOE with @JOSH" );
				expect( result ).toBe( '<a href="https://twitter.com/GREG">@GREG</a> is tweeting <a href="https://twitter.com/JOE">@JOE</a> with <a href="https://twitter.com/JOSH">@JOSH</a>' );
			} );
			
		} );


		describe( "proper handling of HTML in the input string", function() {
		
			it( "should automatically link URLs past the last HTML tag", function() {
				var result = autolinker.link( '<p>Joe went to <a href="http://www.yahoo.com">yahoo</a></p> and http://google.com' );
				expect( result ).toBe( '<p>Joe went to <a href="http://www.yahoo.com">yahoo</a></p> and <a href="http://google.com">google.com</a>' );
			} );
			
		
			it( "should NOT automatically link URLs within the attributes of existing HTML tags", function() {
				var result = autolinker.link( '<p>Joe went to <a href="http://www.yahoo.com">yahoo</a></p>' );
				expect( result ).toBe( '<p>Joe went to <a href="http://www.yahoo.com">yahoo</a></p>' );
			} );
			
		
			it( "should NOT automatically link URLs within the attributes of existing HTML tags when there are prefixed or suffixed spaces in the attribute values", function() {
				var result = autolinker.link( '<p>Joe went to <a href=" http://www.yahoo.com">yahoo</a></p>' );
				expect( result ).toBe( '<p>Joe went to <a href=" http://www.yahoo.com">yahoo</a></p>' );
				
				var result2 = autolinker.link( '<p>Joe went to <a href="http://www.yahoo.com ">yahoo</a></p>' );
				expect( result2 ).toBe( '<p>Joe went to <a href="http://www.yahoo.com ">yahoo</a></p>' );
			} );
			
			
			it( "should NOT automatically link URLs within self-closing tags", function() {
				var result = autolinker.link( 'Just a flower image <img src="https://farm9.staticflickr.com/8378/8578790632_83c6471f3f_b.jpg" />' );
				expect( result ).toBe( 'Just a flower image <img src="https://farm9.staticflickr.com/8378/8578790632_83c6471f3f_b.jpg" />' );
			} );
			
			
			it( "should NOT automatically link a URL found within the inner text of a pre-existing anchor tag", function() {
				var result = autolinker.link( '<p>Joe went to <a href="http://www.yahoo.com">yahoo.com</a></p> yesterday.' );
				expect( result ).toBe( '<p>Joe went to <a href="http://www.yahoo.com">yahoo.com</a></p> yesterday.' );
			} );
			
			
			it( "should NOT automatically link a URL found within the inner text of a pre-existing anchor tag, but link others", function() {
				var result = autolinker.link( '<p>Joe went to google.com, <a href="http://www.yahoo.com">yahoo.com</a>, and weather.com</p> yesterday.' );
				expect( result ).toBe( '<p>Joe went to <a href="http://google.com">google.com</a>, <a href="http://www.yahoo.com">yahoo.com</a>, and <a href="http://weather.com">weather.com</a></p> yesterday.' );
			} );
			
			
			it( "should NOT automatically link an image tag with a URL inside it, inside an anchor tag", function() {
				var result = autolinker.link( '<a href="http://google.com"><img src="http://google.com/someImage.jpg" /></a>' );
				expect( result ).toBe( '<a href="http://google.com"><img src="http://google.com/someImage.jpg" /></a>' );
			} );
			
			
			it( "should NOT automatically link an image tag with a URL inside it, inside an anchor tag, but match urls around the tags", function() {
				var result = autolinker.link( 'google.com looks like <a href="http://google.com"><img src="http://google.com/someImage.jpg" /></a> (at google.com)' );
				expect( result ).toBe( '<a href="http://google.com">google.com</a> looks like <a href="http://google.com"><img src="http://google.com/someImage.jpg" /></a> (at <a href="http://google.com">google.com</a>)' );
			} );
			
			
			it( "should NOT automatically link an image tag with a URL inside of it, when it has another attribute which has extraneous spaces surround its value (Issue #45)", function() {
				var result = autolinker.link( "Testing <img src='http://terryshoemaker.files.wordpress.com/2013/03/placeholder1.jpg' style=' height: 22px; background-color: rgb(0, 188, 204); border-radius: 7px; padding: 2px; margin: 0px 2px;'>" );
				expect( result ).toBe( "Testing <img src='http://terryshoemaker.files.wordpress.com/2013/03/placeholder1.jpg' style=' height: 22px; background-color: rgb(0, 188, 204); border-radius: 7px; padding: 2px; margin: 0px 2px;'>" );
			} );
			
			
			it( "should NOT automatically link a tag within an attribute of another tag (Issue #45)", function() {
				var result = autolinker.link( '<form class="approval-form" name="thumbsUp" ng-submit="postApproval()"> <button type="submit"> <img class="thumbs-up" ng-click="comment.body=\'<img src=\'http://example.com/api-public/images/wg/w/Rating_and_Approval/icon-thumbs-up.png\' style=\'height: 22px; background-color: rgb(0, 188, 204); border-radius: 7px; padding: 2px; margin: 0px 2px;\'>\'+comment.body;" ng-src="http://example.com/api-public/images/wg/w/Rating_and_Approval/icon-thumbs-up.png"> </button> </form>' );
				expect( result ).toBe( '<form class="approval-form" name="thumbsUp" ng-submit="postApproval()"> <button type="submit"> <img class="thumbs-up" ng-click="comment.body=\'<img src=\'http://example.com/api-public/images/wg/w/Rating_and_Approval/icon-thumbs-up.png\' style=\'height: 22px; background-color: rgb(0, 188, 204); border-radius: 7px; padding: 2px; margin: 0px 2px;\'>\'+comment.body;" ng-src="http://example.com/api-public/images/wg/w/Rating_and_Approval/icon-thumbs-up.png"> </button> </form>' );
			} );
			
			
			it( "should NOT remove `br` tags from the output (Issue #46)", function() {
				var result = autolinker.link( "Testing<br /> with<br/> br<br> tags" );
				expect( result ).toBe( "Testing<br /> with<br/> br<br> tags" );
			} );
			
			
			it( "should NOT automatically link anything in a !DOCTYPE tag (Issue #53)", function() {
				var input = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
				
				var result = autolinker.link( input );
				expect( result ).toBe( input );
			} );
			
			
			it( "should automatically link tags after a !DOCTYPE tag", function() {
				var input = [
					'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
					'<html>',
						'<body>',
							'Welcome to mysite.com',
						'</body>',
					'</html>'
				].join( "" );
				
				var result = autolinker.link( input );
				expect( result ).toBe( [
					'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
					'<html>',
						'<body>',
							'Welcome to <a href="http://mysite.com">mysite.com</a>',
						'</body>',
					'</html>'
				].join( "" ) );
			} );
			
			
			it( "should autolink the link, and not fail with 100% cpu in the Regex engine when presented with the input in issue #54", function() {
				var inputStr = "Shai ist endlich in Deutschland! Und wir haben gute Nachrichten! <3 Alle, die den Shai-Rasierer kostenlos probieren, machen am Gewinnspiel eines Jahresvorrates Klingen mit. Den Rasierer bekommst Du kostenlos durch diesen Link: http://dorcoshai.de/pb1205ro, und dann machst Du am Gewinnspiel mit! Gefallt mir klicken, wenn Du gern einen Jahresvorrat Shai haben mochtest. (Y)",
				    result = autolinker.link( inputStr );
				
				expect( result ).toBe( 'Shai ist endlich in Deutschland! Und wir haben gute Nachrichten! <3 Alle, die den Shai-Rasierer kostenlos probieren, machen am Gewinnspiel eines Jahresvorrates Klingen mit. Den Rasierer bekommst Du kostenlos durch diesen Link: <a href="http://dorcoshai.de/pb1205ro">dorcoshai.de/pb1205ro</a>, und dann machst Du am Gewinnspiel mit! Gefallt mir klicken, wenn Du gern einen Jahresvorrat Shai haben mochtest. (Y)' );
			} );
			
			
			it( "should NOT modify the email address with other tags when inside another anchor", function() {
				var input = [
					'<div>First name: Subin</div>',
					'<div>Surname: Sundar</div>',
					'<div>',
						'Email: ',
						'<a href="mailto:subin.sundar@yo.in">',
							'<font color="blue"><u>s</u></font>',
							'<font color="blue"><u>ubin</u></font>',
							'<font color="blue"><u>.sundar@yo.in</u></font>',
						'</a>',
					'</div>'
				].join( "" );
				
				var result = autolinker.link( input );
				expect( result ).toBe( input );
			} );
			
			
			it( "should allow the full range of HTML attribute name characters as specified in the W3C HTML syntax document (http://www.w3.org/TR/html-markup/syntax.html)", function() {
				// Note: We aren't actually expecting the HTML to be modified by this test
				var inAndOutHtml = '<ns:p>Foo <a data-qux-="" href="http://www.example.com">Bar<\/a> Baz<\/ns:p>';
				expect( autolinker.link( inAndOutHtml ) ).toBe( inAndOutHtml );
			} );
	
	
			it( "should properly autolink text within namespaced HTML elements, skipping over html elements with urls in attribute values", function() {
				var html = '<ns:p>Go to google.com or <a data-qux-="test" href="http://www.example.com">Bar<\/a> Baz<\/ns:p>';
				
				var result = autolinker.link( html );
				expect( result ).toBe( '<ns:p>Go to <a href="http://google.com">google.com</a> or <a data-qux-="test" href="http://www.example.com">Bar<\/a> Baz<\/ns:p>' );
			} );
			
			
			it( "should properly skip over attribute names that could be interpreted as urls, while still autolinking urls in their inner text", function() {
				var html = '<div google.com anotherAttr yahoo.com>My div that has an attribute of google.com</div>';
				
				var result = autolinker.link( html );
				expect( result ).toBe( '<div google.com anotherAttr yahoo.com>My div that has an attribute of <a href="http://google.com">google.com</a></div>' );
			} );
			
			
			it( "should properly skip over attribute names that could be interpreted as urls when they have a value, while still autolinking urls in their inner text", function() {
				var html = '<div google.com="yes" anotherAttr=true yahoo.com="true">My div that has an attribute of google.com</div>';
				
				var result = autolinker.link( html );
				expect( result ).toBe( '<div google.com="yes" anotherAttr=true yahoo.com="true">My div that has an attribute of <a href="http://google.com">google.com</a></div>' );
			} );
			
			
			it( "should properly skip over attribute names that could be interpreted as urls when they have a value and any number of spaces between attrs, while still autolinking urls in their inner text", function() {
				var html = '<div  google.com="yes" \t\t anotherAttr=true   yahoo.com="true"  \t>My div that has an attribute of google.com</div>';
				
				var result = autolinker.link( html );
				expect( result ).toBe( '<div  google.com="yes" \t\t anotherAttr=true   yahoo.com="true"  \t>My div that has an attribute of <a href="http://google.com">google.com</a></div>' );
			} );
			
			
			it( "should properly skip over attribute values that could be interpreted as urls/emails/twitter accts, while still autolinking urls in their inner text", function() {
				var html = '<div url="google.com" email="asdf@asdf.com" twitter="@asdf">google.com asdf@asdf.com @asdf</div>';
				
				var result = autolinker.link( html );
				expect( result ).toBe( [
					'<div url="google.com" email="asdf@asdf.com" twitter="@asdf">',
						'<a href="http://google.com">google.com</a> ',
						'<a href="mailto:asdf@asdf.com">asdf@asdf.com</a> ',
						'<a href="https://twitter.com/asdf">@asdf</a>',
					'</div>'
				].join( "" ) );
			} );
			
			
			it( "should properly skip over attribute names and values that could be interpreted as urls/emails/twitter accts, while still autolinking urls in their inner text", function() {
				var html = '<div google.com="google.com" asdf@asdf.com="asdf@asdf.com" @asdf="@asdf">google.com asdf@asdf.com @asdf</div>';
				
				var result = autolinker.link( html );
				expect( result ).toBe( [
					'<div google.com="google.com" asdf@asdf.com="asdf@asdf.com" @asdf="@asdf">',
						'<a href="http://google.com">google.com</a> ',
						'<a href="mailto:asdf@asdf.com">asdf@asdf.com</a> ',
						'<a href="https://twitter.com/asdf">@asdf</a>',
					'</div>'
				].join( "" ) );
			} );
			
			
			it( "should properly handle HTML markup + text nodes that are nested within <a> tags", function() {
				var html = '<a href="http://google.com"><b>google.com</b></a>';
				
				var result = autolinker.link( html );
				expect( result ).toBe( html );
			} );
			
			
			it( "should attempt to handle some invalid HTML markup relating to <a> tags, esp if there are extraneous closing </a> tags", function() {
				var html = '</a><a href="http://google.com">google.com</a>';
				
				var result = autolinker.link( html );
				expect( result ).toBe( html );
			} );
			
			
			it( "should attempt to handle some more complex invalid HTML markup relating to <a> tags, esp if there are extraneous closing </a> tags", function() {
				var html = [
					'</a>',  // invalid
					'<a href="http://google.com">google.com</a>',
					'<div>google.com</div>',
					'</a>',  // invalid
					'<a href="http://yahoo.com">yahoo.com</a>',
					'</a>',  // invalid
					'</a>',  // invalid
					'twitter.com'
				].join( "" );
				
				var result = autolinker.link( html );
				expect( result ).toBe( [
					'</a>',                                                   // invalid - left alone
					'<a href="http://google.com">google.com</a>',             // valid tag - left alone
					'<div><a href="http://google.com">google.com</a></div>',  // autolinked text in <div>
					'</a>',                                                   // invalid - left alone
					'<a href="http://yahoo.com">yahoo.com</a>',               // valid tag - left alone
					'</a>',                                                   // invalid - left alone
					'</a>',                                                   // invalid - left alone
					'<a href="http://twitter.com">twitter.com</a>'            // autolinked text
				].join( "" ) );
			} );
			

			it( "should handle &nbsp; after a url and not treat it as a query string", function() {
				var html = "<p>Joe went to yahoo.com&nbsp;and google.com&nbsp;today</p>";

				var result = autolinker.link( html );
				expect( result ).toBe('<p>Joe went to <a href="http://yahoo.com">yahoo.com</a>&nbsp;and <a href="http://google.com">google.com</a>&nbsp;today</p>');
			} );
			
			
			it( "should handle HTML entities like &nbsp; within a non-autolinked part of a text node, properly appending it to the output", function() {
				var html = "Joe went to yahoo.com and used HTML&nbsp;entities like &gt; and &lt; google.com";

				var result = autolinker.link( html );
				expect( result ).toBe( 'Joe went to <a href="http://yahoo.com">yahoo.com</a> and used HTML&nbsp;entities like &gt; and &lt; <a href="http://google.com">google.com</a>');
			} );
			
			
			it( "should handle &amp; inside a url and not ignore it", function() {
				var html = "<p>Joe went to example.com?arg=1&amp;arg=2&amp;arg=3</p>";
				
				var result = autolinker.link( html );
				expect( result ).toBe( '<p>Joe went to <a href="http://example.com?arg=1&arg=2&arg=3">example.com?arg=1&amp;arg=2&amp;arg=3</a></p>' );
			} );
			
			
			it( "should handle line breaks inside an HTML tag, not accidentally autolinking a URL within the tag", function() {
				var html = '<a href="http://close.io/" style="font-family: Helvetica,\nArial">http://close.io</a>';
				
				var result = autolinker.link( html );
				expect( result ).toBe( '<a href="http://close.io/" style="font-family: Helvetica,\nArial">http://close.io</a>' );
			} );

			
			it( "should handle a URL inside an HTML-encoded anchor tag (Issue #76)", function() {
				var html = "Joe learned about anchor tags on the &lt;a href=&quot;http://www.w3schools.com/aaa&quot;&gt;W3SCHOOLS&lt;/a&gt; site ...";
				var tobe = "Joe learned about anchor tags on the &lt;a href=&quot;<a href=\"http://www.w3schools.com/aaa\">w3schools.com/aaa</a>&quot;&gt;W3SCHOOLS&lt;/a&gt; site ...";

				var result = autolinker.link( html );
				expect( result ).toBe( tobe );
			} );
			
		} );
		
		
		describe( "`newWindow` option", function() {
		
			it( "should not add target=\"_blank\" when the 'newWindow' option is set to false", function() {
				var result = Autolinker.link( "Test http://url.com", { newWindow: false } );
				expect( result ).toBe( 'Test <a href="http://url.com">url.com</a>' );
			} );
		
			
			it( "should add target=\"_blank\" when the 'newWindow' option is set to true", function() {
				var result = Autolinker.link( "Test http://url.com", { newWindow: true } );
				expect( result ).toBe( 'Test <a href="http://url.com" target="_blank">url.com</a>' );
			} );
			
		} );
		
		
		describe( "`stripPrefix` option", function() {
		
			it( "should not remove the prefix for non-http protocols", function() {
				var result = Autolinker.link( "Test file://execute-virus.com", { stripPrefix: true, newWindow: false } );
				expect( result ).toBe( 'Test <a href="file://execute-virus.com">file://execute-virus.com</a>' );
			} );
			
			
			it( "should remove 'http://www.' when the 'stripPrefix' option is set to `true`", function() {
				var result = Autolinker.link( "Test http://www.url.com", { stripPrefix: true, newWindow: false } );
				expect( result ).toBe( 'Test <a href="http://www.url.com">url.com</a>' );
			} );
			
			
			it( "should not remove 'http://www.' when the 'stripPrefix' option is set to `false`", function() {
				var result = Autolinker.link( "Test http://www.url.com", { stripPrefix: false, newWindow: false } );
				expect( result ).toBe( 'Test <a href="http://www.url.com">http://www.url.com</a>' );
			} );
			
			
			it( "should remove the prefix by default", function() {
				var result = Autolinker.link( "Test http://www.url.com", { newWindow: false } );
				expect( result ).toBe( 'Test <a href="http://www.url.com">url.com</a>' );
			} );
			
		} );
		
		
		describe( "`truncate` option", function() {
		
			it( "should truncate long a url/email/twitter to the given number of characters with the 'truncate' option specified", function() {
				var result = Autolinker.link( "Test http://url.com/with/path", { truncate: 12, newWindow: false } );
				
				expect( result ).toBe( 'Test <a href="http://url.com/with/path">url.com/wi..</a>' );
			} );
			
			
			it( "should leave a url/email/twitter alone if the length of the url is exactly equal to the length of the 'truncate' option", function() {
				var result = Autolinker.link( "Test http://url.com/with/path", { truncate: 'url.com/with/path'.length, newWindow: false } );  // the exact length of the link
				
				expect( result ).toBe( 'Test <a href="http://url.com/with/path">url.com/with/path</a>' );
			} );
			
			
			it( "should leave a url/email/twitter alone if it does not exceed the given number of characters provided in the 'truncate' option", function() {
				var result = Autolinker.link( "Test http://url.com/with/path", { truncate: 25, newWindow: false } );  // just a random high number
				
				expect( result ).toBe( 'Test <a href="http://url.com/with/path">url.com/with/path</a>' );
			} );
			
		} );
		
		describe( "`className` option", function() {
		
			it( "should not add className when the 'className' option is not a string with at least 1 character", function() {
				var result = Autolinker.link( "Test http://url.com" );
				expect( result ).toBe( 'Test <a href="http://url.com" target="_blank">url.com</a>' );

				result = Autolinker.link( "Test http://url.com", { className: null } );
				expect( result ).toBe( 'Test <a href="http://url.com" target="_blank">url.com</a>' );

				result = Autolinker.link( "Test http://url.com", { className: "" } );
				expect( result ).toBe( 'Test <a href="http://url.com" target="_blank">url.com</a>' );
			} );

			
			it( "should add className to links", function() {
				var result = Autolinker.link( "Test http://url.com", { className: 'myLink' } );
				expect( result ).toBe( 'Test <a href="http://url.com" class="myLink myLink-url" target="_blank">url.com</a>' );
			} );

			
			it( "should add className to email links", function() {
				var result = Autolinker.link( "Iggy's email is mr@iggypop.com", { email: true, className: 'myLink' } );
				expect( result ).toBe( 'Iggy\'s email is <a href="mailto:mr@iggypop.com" class="myLink myLink-email" target="_blank">mr@iggypop.com</a>' );
			} );

			
			it( "should add className to twitter links", function() {
				var result = Autolinker.link( "hi from @iggypopschest", { twitter: true, className: 'myLink' } );
				expect( result ).toBe( 'hi from <a href="https://twitter.com/iggypopschest" class="myLink myLink-twitter" target="_blank">@iggypopschest</a>' );
			} );
			
		} );
		
		
		describe( "`urls`, `email`, and `twitter` options", function() {
			
			it( "should link all 3 types if all 3 urls/email/twitter options are enabled", function() {
				var result = Autolinker.link( "Website: asdf.com, Email: asdf@asdf.com, Twitter: @asdf", { newWindow: false } );
				expect( result ).toBe( [
					'Website: <a href="http://asdf.com">asdf.com</a>',
					'Email: <a href="mailto:asdf@asdf.com">asdf@asdf.com</a>',
					'Twitter: <a href="https://twitter.com/asdf">@asdf</a>'
				].join( ", " ) );
			} );
			
			
			it( "should not link urls when they are disabled", function() {
				var result = Autolinker.link( "Website: asdf.com, Email: asdf@asdf.com, Twitter: @asdf", { newWindow: false, urls: false } );
				expect( result ).toBe( [
					'Website: asdf.com',
					'Email: <a href="mailto:asdf@asdf.com">asdf@asdf.com</a>',
					'Twitter: <a href="https://twitter.com/asdf">@asdf</a>'
				].join( ", " ) );
			} );
			
			
			it( "should not link email addresses when they are disabled", function() {
				var result = Autolinker.link( "Website: asdf.com, Email: asdf@asdf.com, Twitter: @asdf", { newWindow: false, email: false } );
				expect( result ).toBe( [
					'Website: <a href="http://asdf.com">asdf.com</a>',
					'Email: asdf@asdf.com',
					'Twitter: <a href="https://twitter.com/asdf">@asdf</a>'
				].join( ", " ) );
			} );
			
			
			it( "should not link Twitter handles when they are disabled", function() {
				var result = Autolinker.link( "Website: asdf.com, Email: asdf@asdf.com, Twitter: @asdf", { newWindow: false, twitter: false } );
				expect( result ).toBe( [
					'Website: <a href="http://asdf.com">asdf.com</a>',
					'Email: <a href="mailto:asdf@asdf.com">asdf@asdf.com</a>',
					'Twitter: @asdf'
				].join( ", " ) );
			} );
			
		} );
		
		
		describe( "`replaceFn` option", function() {
			var returnTrueFn = function() { return true; },
			    returnFalseFn = function() { return false; };
			
			
			it( "should populate a UrlMatch object with the appropriate properties", function() {
				var replaceFnCallCount = 0;
				var result = Autolinker.link( "Website: asdf.com ", {  // purposeful trailing space
					replaceFn : function( autolinker, match ) {
						replaceFnCallCount++;
						
						expect( match.getMatchedText() ).toBe( 'asdf.com' );
						expect( match.getUrl() ).toBe( 'http://asdf.com' );
					}
				} );
				
				expect( replaceFnCallCount ).toBe( 1 );  // make sure the replaceFn was called
			} );
			
			
			it( "should populate an EmailMatch object with the appropriate properties", function() {
				var replaceFnCallCount = 0;
				var result = Autolinker.link( "Email: asdf@asdf.com ", {  // purposeful trailing space
					replaceFn : function( autolinker, match ) {
						replaceFnCallCount++;
						
						expect( match.getMatchedText() ).toBe( 'asdf@asdf.com' );
						expect( match.getEmail() ).toBe( 'asdf@asdf.com' );
					}
				} );
				
				expect( replaceFnCallCount ).toBe( 1 );  // make sure the replaceFn was called
			} );
			
			
			it( "should populate a TwitterMatch object with the appropriate properties", function() {
				var replaceFnCallCount = 0;
				var result = Autolinker.link( "Twitter: @myTwitter ", {  // purposeful trailing space
					replaceFn : function( autolinker, match ) {
						replaceFnCallCount++;
						
						expect( match.getMatchedText() ).toBe( '@myTwitter' );
						expect( match.getTwitterHandle() ).toBe( 'myTwitter' );
					}
				} );
				
				expect( replaceFnCallCount ).toBe( 1 );  // make sure the replaceFn was called
			} );
			
			
			it( "should replace the match as Autolinker would normally do when `true` is returned from the `replaceFn`", function() {
				var result = Autolinker.link( "Website: asdf.com, Email: asdf@asdf.com, Twitter: @asdf", { 
					newWindow : false,  // just to suppress the target="_blank" from the output for this test
					replaceFn : returnTrueFn
				} );
				
				expect( result ).toBe( [
					'Website: <a href="http://asdf.com">asdf.com</a>',
					'Email: <a href="mailto:asdf@asdf.com">asdf@asdf.com</a>',
					'Twitter: <a href="https://twitter.com/asdf">@asdf</a>'
				].join( ", " ) );
			} );
			
			
			it( "should replace the match as Autolinker would normally do when there is no return value (i.e. `undefined` is returned) from the `replaceFn`", function() {
				var result = Autolinker.link( "Website: asdf.com, Email: asdf@asdf.com, Twitter: @asdf", { 
					newWindow : false,  // just to suppress the target="_blank" from the output for this test
					replaceFn : function() {}  // no return value (`undefined` is returned)
				} );
				
				expect( result ).toBe( [
					'Website: <a href="http://asdf.com">asdf.com</a>',
					'Email: <a href="mailto:asdf@asdf.com">asdf@asdf.com</a>',
					'Twitter: <a href="https://twitter.com/asdf">@asdf</a>'
				].join( ", " ) );
			} );
			
			
			it( "should leave the match as-is when `false` is returned from the `replaceFn`", function() {
				var result = Autolinker.link( "Website: asdf.com, Email: asdf@asdf.com, Twitter: @asdf", {
					replaceFn : returnFalseFn
				} );
				
				expect( result ).toBe( [
					'Website: asdf.com',
					'Email: asdf@asdf.com',
					'Twitter: @asdf'
				].join( ", " ) );
			} );
			
			
			it( "should use a string returned from the `replaceFn` as the HTML that is replaced in the input", function() {
				var result = Autolinker.link( "Website: asdf.com, Email: asdf@asdf.com, Twitter: @asdf", {
					replaceFn : function() { return "test"; }
				} );
				
				expect( result ).toBe( "Website: test, Email: test, Twitter: test" );
			} );
			
			
			it( "should allow an Autolinker.HtmlTag instance to be returned from the `replaceFn`, and use that as the HTML to be replaced from the input", function() {
				var result = Autolinker.link( "Website: asdf.com", {
					newWindow : false,
					
					replaceFn : function( autolinker, match ) {
						var tag = autolinker.getTagBuilder().build( match );
						tag.setInnerHtml( 'asdf!' );  // just to check that we're replacing with the returned `tag` instance
						return tag;
					}
				} );
				
				expect( result ).toBe( 'Website: <a href="http://asdf.com">asdf!</a>' );
			} );
			
			
			it( "should allow an Autolinker.HtmlTag instance to be modified before being returned from the `replaceFn`", function() {
				var result = Autolinker.link( "Website: asdf.com", {
					newWindow : false,
					
					replaceFn : function( autolinker, match ) {
						var tag = autolinker.getTagBuilder().build( match );
						tag.addClass( 'test' );
						tag.addClass( 'test2' );
						tag.setAttr( 'rel', 'nofollow' );
						return tag;
					}
				} );
				
				expect( result ).toBe( 'Website: <a href="http://asdf.com" class="test test2" rel="nofollow">asdf.com</a>' );
			} );
			
			
			it( "should not drop a trailing parenthesis of a URL match if the `replaceFn` returns false", function() {
				var result = Autolinker.link( "Go to the website (asdf.com) and see", {
					newWindow : false,
					replaceFn : returnFalseFn
				} );
				
				expect( result ).toBe( 'Go to the website (asdf.com) and see' );
			} );
			
			
			describe( 'special cases which check the `prefixStr` and `suffixStr` vars in the code', function() {
			
				it( "should leave the match as-is when the `replaceFn` returns `false` for a Twitter match", function() {
					var result = Autolinker.link( "@asdf", { replaceFn: returnFalseFn } );
					expect( result ).toBe( "@asdf" );
					
					var result2 = Autolinker.link( "Twitter: @asdf", { replaceFn: returnFalseFn } );
					expect( result2 ).toBe( "Twitter: @asdf" );
				} );
				
				
				it( "should leave the match as-is when the `replaceFn` returns `false`, and the URL was wrapped in parenthesis", function() {
					var result = Autolinker.link( "Go to (yahoo.com) my friend", { replaceFn: returnFalseFn } );
					expect( result ).toBe( "Go to (yahoo.com) my friend" );
					
					var result2 = Autolinker.link( "Go to en.wikipedia.org/wiki/IANA_(disambiguation) my friend", { replaceFn: returnFalseFn } );
					expect( result2 ).toBe( "Go to en.wikipedia.org/wiki/IANA_(disambiguation) my friend" );
					
					var result3 = Autolinker.link( "Go to (en.wikipedia.org/wiki/IANA_(disambiguation)) my friend", { replaceFn: returnFalseFn } );
					expect( result3 ).toBe( "Go to (en.wikipedia.org/wiki/IANA_(disambiguation)) my friend" );
				} );
				
				
				it( "should leave the match as-is when the `replaceFn` returns `false`, and the URL was a protocol-relative match", function() {
					var result = Autolinker.link( "Go to //yahoo.com my friend", { replaceFn: returnFalseFn } );
					expect( result ).toBe( "Go to //yahoo.com my friend" );
				} );
				
			} );
			
		} );
		
	} );
	
} );
