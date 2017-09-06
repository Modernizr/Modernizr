/*global Autolinker, _, describe, beforeEach, afterEach, it, expect */
describe( "Autolinker.HtmlTag", function() {
	var HtmlTag = Autolinker.HtmlTag;
	
	
	it( "should be able to be instantiated with no arguments", function() {
		expect( function() {
			var tag = new HtmlTag();
		} ).not.toThrow();
	} );
	
	
	it( "should be able to be configured via the config options", function() {
		var tag = new HtmlTag( {
			tagName   : 'a',
			attrs     : { attr1: 'value1', attr2: 'value2' },
			innerHtml : "Hello"
		} );
		
		expect( tag.getTagName() ).toBe( 'a' );
		expect( tag.getAttrs() ).toEqual( { attr1: 'value1', attr2: 'value2' } );
		expect( tag.getInnerHtml() ).toBe( "Hello" );
	} );
	
	
	it( "should be able to be configured via setters", function() {
		var tag = new HtmlTag();
		tag.setTagName( 'a' );
		tag.setAttrs( { attr1: 'value1', attr2: 'value2' } );
		tag.setInnerHtml( "Hello" );
		
		expect( tag.getTagName() ).toBe( 'a' );
		expect( tag.getAttrs() ).toEqual( { attr1: 'value1', attr2: 'value2' } );
		expect( tag.getInnerHtml() ).toBe( "Hello" );
	} );
	
	
	describe( 'setTagName()', function() {
		
		it( "should set, and override, the tag name", function() {
			var tag = new HtmlTag();
			
			tag.setTagName( 'a' );
			expect( tag.getTagName() ).toBe( 'a' );
			
			tag.setTagName( 'button' );
			expect( tag.getTagName() ).toBe( 'button' );
		} );
		
		
		it( "should return a reference to the HtmlTag instance, to allow method chaining", function() {
			var tag = new HtmlTag();
			
			expect( tag.setTagName( 'a' ) ).toBe( tag );  // return value should be the HtmlTag itself
		} );
		
	} );
	
	
	describe( 'setAttr()', function() {
		
		it( "should set, then override, attribute properties", function() {
			var tag = new HtmlTag();
			
			tag.setAttr( 'attr1', 'value1' );  // note: this call should lazily instantiate the `attrs` map
			tag.setAttr( 'attr2', 'value2' );
			expect( tag.getAttrs() ).toEqual( { attr1: 'value1', attr2: 'value2' } );
			
			tag.setAttr( 'attr1', 42 );
			expect( tag.getAttrs() ).toEqual( { attr1: 42, attr2: 'value2' } );
		} );
		
		
		it( "should return a reference to the HtmlTag instance, to allow method chaining", function() {
			var tag = new HtmlTag();
			
			expect( tag.setAttr( 'href', 'test' ) ).toBe( tag );  // return value should be the HtmlTag itself
		} );
		
	} );
	
	
	describe( 'setAttrs()', function() {
		
		it( "should set, then override, attribute properties", function() {
			var tag = new HtmlTag();
			
			tag.setAttrs( { attr1: 'value1', attr2: 'value2' } );  // note: this call should lazily instantiate the `attrs` map
			expect( tag.getAttrs() ).toEqual( { attr1: 'value1', attr2: 'value2' } );
			
			tag.setAttrs( { attr1: 42 } );
			expect( tag.getAttrs() ).toEqual( { attr1: 42, attr2: 'value2' } );
		} );
		
		
		it( "should return a reference to the HtmlTag instance, to allow method chaining", function() {
			var tag = new HtmlTag();
			
			expect( tag.setAttrs( { 'href': 'test' } ) ).toBe( tag );  // return value should be the HtmlTag itself
		} );
		
	} );
	
	
	describe( 'setClass()', function() {
		var tag;
		
		beforeEach( function() {
			tag = new HtmlTag();
		} );
		
		
		it( "should set the CSS class to the tag when there are none yet", function() {
			tag.setClass( 'test' );
			
			expect( tag.getClass() ).toBe( 'test' );
		} );
		
		
		it( "should overwrite the current CSS classes on the tag", function() {
			tag.setClass( 'test' );
			tag.setClass( 'test_override' );
			
			expect( tag.getClass() ).toBe( 'test_override' );
		} );
		
		
		it( "should return a reference to the HtmlTag instance, to allow method chaining", function() {
			expect( tag.setClass( 'test' ) ).toBe( tag );  // return value should be the HtmlTag itself
		} );
		
	} );
	
	
	describe( 'addClass()', function() {
		var tag;
		
		beforeEach( function() {
			tag = new HtmlTag();
		} );
		
		
		it( "should add a CSS class to the tag when there are none yet", function() {
			tag.addClass( 'test' );
			expect( tag.getClass() ).toBe( 'test' );
		} );
		
		
		it( "should add multiple CSS classes to the tag when there are none yet", function() {
			tag.addClass( 'test1 test2' );
			expect( tag.getClass() ).toBe( 'test1 test2' );
		} );
		
		
		it( "should add a CSS class to existing CSS classes", function() {
			tag.addClass( 'test1' );
			tag.addClass( 'test2' );
			
			expect( tag.getClass() ).toBe( 'test1 test2' );
		} );
		
		
		it( "should add multiple CSS classes to existing CSS classes", function() {
			tag.addClass( 'test1 test2' );
			tag.addClass( 'test3 test4' );
			
			expect( tag.getClass() ).toBe( 'test1 test2 test3 test4' );
		} );
		
		
		it( "should not add duplicate CSS classes to the tag", function() {
			tag.addClass( 'test1 test2' );
			tag.addClass( 'test1 test3 test4 test4' );
			
			expect( tag.getClass() ).toBe( 'test1 test2 test3 test4' );
		} );
		
		
		it( "should return a reference to the HtmlTag instance, to allow method chaining", function() {
			expect( tag.addClass( 'test' ) ).toBe( tag );  // return value should be the HtmlTag itself
		} );
		
	} );
	
	
	
	describe( 'removeClass()', function() {
		var tag;
		
		beforeEach( function() {
			tag = new HtmlTag();
		} );
		
		
		it( "should have no effect when removing a CSS class from an HtmlTag with no CSS classes", function() {
			expect( function() {
				tag.removeClass( 'test' );  // simply make sure an error isn't thrown
			} ).not.toThrow();
		} );
		
		
		it( "should remove a single CSS class from the HtmlTag", function() {
			tag.addClass( 'test1 test2 test3 test4' );
			tag.removeClass( 'test1' );
			
			expect( tag.getClass() ).toBe( 'test2 test3 test4' );
		} );
		
		
		it( "should remove multiple CSS classes from the HtmlTag", function() {
			tag.addClass( 'test1 test2 test3 test4' );
			tag.removeClass( 'test1 test3' );
			
			expect( tag.getClass() ).toBe( 'test2 test4' );
		} );
		
		
		it( "should return a reference to the HtmlTag instance, to allow method chaining", function() {
			expect( tag.removeClass( 'test' ) ).toBe( tag );  // return value should be the HtmlTag itself
		} );
		
	} );
	
	
	describe( 'getClass()', function() {
		
		it( "should return an empty string when there are no CSS classes on the HtmlTag", function() {
			var tag = new HtmlTag();
			
			expect( tag.getClass() ).toBe( "" );
		} );
		
		
		it( "should return the CSS classes configured on the HtmlTag", function() {
			var tag = new HtmlTag( { 
				attrs: { 'class': "test1 test2" }
			} );
			
			expect( tag.getClass() ).toBe( "test1 test2" );
		} );
		
		
		it( "should return the CSS classes set using addClass()", function() {
			var tag = new HtmlTag();
			tag.addClass( "test1 test2" );
			
			expect( tag.getClass() ).toBe( "test1 test2" );
		} );
		
	} );
	
	
	describe( 'hasClass()', function() {
		var tag;
		
		beforeEach( function() {
			tag = new HtmlTag();
		} );
		
		
		it( "should return `false` when there are no CSS classes on the HtmlTag", function() {
			expect( tag.hasClass( 'test' ) ).toBe( false );
		} );
		
		
		it( "should return `true` for a CSS class that exists on the HtmlTag", function() {
			tag.addClass( 'test' );
			
			expect( tag.hasClass( 'test' ) ).toBe( true );
		} );
		
		
		it( "should return `true` for a CSS class that exists on the HtmlTag, when there are multiple CSS classes", function() {
			tag.addClass( 'test1 test2' );
			
			expect( tag.hasClass( 'test1' ) ).toBe( true );
			expect( tag.hasClass( 'test2' ) ).toBe( true );
			expect( tag.hasClass( 'test3' ) ).toBe( false );
		} );
		
		
		it( "should return `false` for a CSS class that is a substring of a CSS class on the HtmlTag", function() {
			tag.addClass( 'longCssClass' );
			
			expect( tag.hasClass( 'longCss' ) ).toBe( false );
		} );
		
	} );
	
	
	describe( 'setInnerHtml()', function() {
		
		it( "should set, then override, the tag's inner HTML", function() {
			var tag = new HtmlTag();
			
			tag.setInnerHtml( "test" );
			expect( tag.getInnerHtml() ).toBe( "test" );
			
			tag.setInnerHtml( "test2" );
			expect( tag.getInnerHtml() ).toBe( "test2" );
		} );
		
		
		it( "should return a reference to the HtmlTag instance, to allow method chaining", function() {
			var tag = new HtmlTag();
			
			expect( tag.setInnerHtml( "test" ) ).toBe( tag );  // return value should be the HtmlTag itself
		} );
		
	} );
	
	
	describe( 'getInnerHtml()', function() {
		
		it( "should return an empty string if no inner HTML has been set", function() {
			var tag = new HtmlTag();
			
			expect( tag.getInnerHtml() ).toBe( "" );
		} );
		
		
		it( "should return the inner HTML set during construction", function() {
			var tag = new HtmlTag( { innerHtml: "test" } );
			
			expect( tag.getInnerHtml() ).toBe( "test" );
		} );
		
		
		it( "should return the inner HTML set with setInnerHtml()", function() {
			var tag = new HtmlTag();
			tag.setInnerHtml( "test" );
			
			expect( tag.getInnerHtml() ).toBe( "test" );
		} );
		
	} );
	
	
	describe( 'toString()', function() {
		
		it( "should populate only the tag name when no attribute are set, and no inner HTML is set", function() {
			var tag = new HtmlTag( {
				tagName : 'a'
			} );
			
			expect( tag.toString() ).toBe( '<a></a>' );
		} );
		
		
		it( "should populate only the tag name and inner HTML when no attribute are set", function() {
			var tag = new HtmlTag( {
				tagName : 'a',
				innerHtml : "My Site"
			} );
			
			expect( tag.toString() ).toBe( '<a>My Site</a>' );
		} );
		
		
		it( "should populate both the tag name and attributes when set", function() {
			var tag = new HtmlTag( {
				tagName : 'a',
				attrs   : { href: 'http://path/to/site', rel: 'nofollow' }
			} );
			
			expect( tag.toString() ).toBe( '<a href="http://path/to/site" rel="nofollow"></a>' );
		} );
		
		
		it( "should populate all 3: tag name, attributes, and inner HTML when set", function() {
			var tag = new HtmlTag( {
				tagName   : 'a',
				attrs     : { href: 'http://path/to/site', rel: 'nofollow' },
				innerHtml : "My Site"
			} );
			
			expect( tag.toString() ).toBe( '<a href="http://path/to/site" rel="nofollow">My Site</a>' );
		} );
		
		
		it( "should properly build an HTML string from just the mutator methods", function() {
			var tag = new HtmlTag();
			tag.setTagName( 'a' );
			tag.addClass( 'test' );
			tag.addClass( 'test2' );
			tag.setAttr( 'href', 'http://path/to/site' );
			tag.setInnerHtml( 'My Site' );
			
			expect( tag.toString() ).toBe( '<a class="test test2" href="http://path/to/site">My Site</a>' );
		} );
		
	} );
	
} );