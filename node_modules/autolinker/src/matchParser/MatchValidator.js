/*global Autolinker */
/*jshint scripturl:true */
/**
 * @private
 * @class Autolinker.MatchValidator
 * @extends Object
 * 
 * Used by Autolinker to filter out false positives from the {@link Autolinker#matcherRegex}.
 * 
 * Due to the limitations of regular expressions (including the missing feature of look-behinds in JS regular expressions),
 * we cannot always determine the validity of a given match. This class applies a bit of additional logic to filter out any
 * false positives that have been matched by the {@link Autolinker#matcherRegex}.
 */
Autolinker.MatchValidator = Autolinker.Util.extend( Object, {
	
	/**
	 * @private
	 * @property {RegExp} invalidProtocolRelMatchRegex
	 * 
	 * The regular expression used to check a potential protocol-relative URL match, coming from the 
	 * {@link Autolinker#matcherRegex}. A protocol-relative URL is, for example, "//yahoo.com"
	 * 
	 * This regular expression checks to see if there is a word character before the '//' match in order to determine if 
	 * we should actually autolink a protocol-relative URL. This is needed because there is no negative look-behind in 
	 * JavaScript regular expressions. 
	 * 
	 * For instance, we want to autolink something like "Go to: //google.com", but we don't want to autolink something 
	 * like "abc//google.com"
	 */
	invalidProtocolRelMatchRegex : /^[\w]\/\//,
	
	/**
	 * Regex to test for a full protocol, with the two trailing slashes. Ex: 'http://'
	 * 
	 * @private
	 * @property {RegExp} hasFullProtocolRegex
	 */
	hasFullProtocolRegex : /^[A-Za-z][-.+A-Za-z0-9]+:\/\//,
	
	/**
	 * Regex to find the URI scheme, such as 'mailto:'.
	 * 
	 * This is used to filter out 'javascript:' and 'vbscript:' schemes.
	 * 
	 * @private
	 * @property {RegExp} uriSchemeRegex
	 */
	uriSchemeRegex : /^[A-Za-z][-.+A-Za-z0-9]+:/,
	
	/**
	 * Regex to determine if at least one word char exists after the protocol (i.e. after the ':')
	 * 
	 * @private
	 * @property {RegExp} hasWordCharAfterProtocolRegex
	 */
	hasWordCharAfterProtocolRegex : /:[^\s]*?[A-Za-z]/,
	
	
	/**
	 * Determines if a given match found by {@link Autolinker#processTextNode} is valid. Will return `false` for:
	 * 
	 * 1) URL matches which do not have at least have one period ('.') in the domain name (effectively skipping over 
	 *    matches like "abc:def"). However, URL matches with a protocol will be allowed (ex: 'http://localhost')
	 * 2) URL matches which do not have at least one word character in the domain name (effectively skipping over
	 *    matches like "git:1.0").
	 * 3) A protocol-relative url match (a URL beginning with '//') whose previous character is a word character 
	 *    (effectively skipping over strings like "abc//google.com")
	 * 
	 * Otherwise, returns `true`.
	 * 
	 * @param {String} urlMatch The matched URL, if there was one. Will be an empty string if the match is not a URL match.
	 * @param {String} protocolUrlMatch The match URL string for a protocol match. Ex: 'http://yahoo.com'. This is used to match
	 *   something like 'http://localhost', where we won't double check that the domain name has at least one '.' in it.
	 * @param {String} protocolRelativeMatch The protocol-relative string for a URL match (i.e. '//'), possibly with a preceding
	 *   character (ex, a space, such as: ' //', or a letter, such as: 'a//'). The match is invalid if there is a word character
	 *   preceding the '//'.
	 * @return {Boolean} `true` if the match given is valid and should be processed, or `false` if the match is invalid and/or 
	 *   should just not be processed.
	 */
	isValidMatch : function( urlMatch, protocolUrlMatch, protocolRelativeMatch ) {
		if(
			( protocolUrlMatch && !this.isValidUriScheme( protocolUrlMatch ) ) ||
			this.urlMatchDoesNotHaveProtocolOrDot( urlMatch, protocolUrlMatch ) ||       // At least one period ('.') must exist in the URL match for us to consider it an actual URL, *unless* it was a full protocol match (like 'http://localhost')
			this.urlMatchDoesNotHaveAtLeastOneWordChar( urlMatch, protocolUrlMatch ) ||  // At least one letter character must exist in the domain name after a protocol match. Ex: skip over something like "git:1.0"
			this.isInvalidProtocolRelativeMatch( protocolRelativeMatch )                 // A protocol-relative match which has a word character in front of it (so we can skip something like "abc//google.com")
		) {
			return false;
		}
		
		return true;
	},
	
	
	/**
	 * Determines if the URI scheme is a valid scheme to be autolinked. Returns `false` if the scheme is 
	 * 'javascript:' or 'vbscript:'
	 * 
	 * @private
	 * @param {String} uriSchemeMatch The match URL string for a full URI scheme match. Ex: 'http://yahoo.com' 
	 *   or 'mailto:a@a.com'.
	 * @return {Boolean} `true` if the scheme is a valid one, `false` otherwise.
	 */
	isValidUriScheme : function( uriSchemeMatch ) {
		var uriScheme = uriSchemeMatch.match( this.uriSchemeRegex )[ 0 ].toLowerCase();
		
		return ( uriScheme !== 'javascript:' && uriScheme !== 'vbscript:' );
	},
	
	
	/**
	 * Determines if a URL match does not have either:
	 * 
	 * a) a full protocol (i.e. 'http://'), or
	 * b) at least one dot ('.') in the domain name (for a non-full-protocol match).
	 * 
	 * Either situation is considered an invalid URL (ex: 'git:d' does not have either the '://' part, or at least one dot
	 * in the domain name. If the match was 'git:abc.com', we would consider this valid.)
	 * 
	 * @private
	 * @param {String} urlMatch The matched URL, if there was one. Will be an empty string if the match is not a URL match.
	 * @param {String} protocolUrlMatch The match URL string for a protocol match. Ex: 'http://yahoo.com'. This is used to match
	 *   something like 'http://localhost', where we won't double check that the domain name has at least one '.' in it.
	 * @return {Boolean} `true` if the URL match does not have a full protocol, or at least one dot ('.') in a non-full-protocol
	 *   match.
	 */
	urlMatchDoesNotHaveProtocolOrDot : function( urlMatch, protocolUrlMatch ) {
		return ( !!urlMatch && ( !protocolUrlMatch || !this.hasFullProtocolRegex.test( protocolUrlMatch ) ) && urlMatch.indexOf( '.' ) === -1 );
	},
	
	
	/**
	 * Determines if a URL match does not have at least one word character after the protocol (i.e. in the domain name).
	 * 
	 * At least one letter character must exist in the domain name after a protocol match. Ex: skip over something 
	 * like "git:1.0"
	 * 
	 * @private
	 * @param {String} urlMatch The matched URL, if there was one. Will be an empty string if the match is not a URL match.
	 * @param {String} protocolUrlMatch The match URL string for a protocol match. Ex: 'http://yahoo.com'. This is used to
	 *   know whether or not we have a protocol in the URL string, in order to check for a word character after the protocol
	 *   separator (':').
	 * @return {Boolean} `true` if the URL match does not have at least one word character in it after the protocol, `false`
	 *   otherwise.
	 */
	urlMatchDoesNotHaveAtLeastOneWordChar : function( urlMatch, protocolUrlMatch ) {
		if( urlMatch && protocolUrlMatch ) {
			return !this.hasWordCharAfterProtocolRegex.test( urlMatch );
		} else {
			return false;
		}
	},
	
	
	/**
	 * Determines if a protocol-relative match is an invalid one. This method returns `true` if there is a `protocolRelativeMatch`,
	 * and that match contains a word character before the '//' (i.e. it must contain whitespace or nothing before the '//' in
	 * order to be considered valid).
	 * 
	 * @private
	 * @param {String} protocolRelativeMatch The protocol-relative string for a URL match (i.e. '//'), possibly with a preceding
	 *   character (ex, a space, such as: ' //', or a letter, such as: 'a//'). The match is invalid if there is a word character
	 *   preceding the '//'.
	 * @return {Boolean} `true` if it is an invalid protocol-relative match, `false` otherwise.
	 */
	isInvalidProtocolRelativeMatch : function( protocolRelativeMatch ) {
		return ( !!protocolRelativeMatch && this.invalidProtocolRelMatchRegex.test( protocolRelativeMatch ) );
	}

} );