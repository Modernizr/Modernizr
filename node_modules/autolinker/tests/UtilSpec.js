/*global Autolinker, _, describe, beforeEach, afterEach, it, expect */
describe( "Autolinker.Util", function() {
	var Util = Autolinker.Util;
	
	
	describe( 'splitAndCapture()', function() {
		
		it( "should throw an error if the supplied regular expression does not have the `global` flag set", function() {
			expect( function() {
				Util.splitAndCapture( 'test', /,/ );  // note: no 'g' flag
			} ).toThrow( new Error( "`splitRegex` must have the 'g' flag set" ) );
		} );
		
		
		it( "should return an array with the 'split' characters included", function() {
			var result = Util.splitAndCapture( 'a,b,c', /,/g );
			
			expect( result ).toEqual( [ 'a', ',', 'b', ',', 'c' ] );
		} );
		
		
		it( "should return an array with the 'split' characters included, when there are multiple sequences of characters to split on", function() {
			var re = /(&nbsp;|&#160;|&lt;|&#60;|&gt;|&#62;)/g,
			    result = Util.splitAndCapture( 'Joe went to yahoo.com and used HTML&nbsp;entities like &gt; and &lt; today', re );
			
			expect( result ).toEqual( [ 'Joe went to yahoo.com and used HTML', '&nbsp;', 'entities like ', '&gt;', ' and ', '&lt;', ' today' ] );
		} );
		
	} );
	
} );