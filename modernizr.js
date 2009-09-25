/*!
 * Modernizr JavaScript library 1.0c
 * http://modernizr.com/
 *
 * Copyright (c) 2009 Faruk Ates - http://farukat.es/
 * Licensed under the MIT license.
 * http://modernizr.com/license/
 *
 * Featuring major contributions by
 * Paul Irish  - http://paulirish.com
 * Ben Alman   - http://benalman.com/
 */
/*
 * Modernizr is a script that will detect native CSS3 and HTML5 features
 * available in the current UA and provide an object containing all
 * features with a true/false value, depending on whether the UA has
 * native support for it or not.
 * 
 * In addition to that, Modernizr will add classes to the <body>
 * element of the page, one for each cutting-edge feature. If the UA
 * supports it, a class like "cssgradients" will be added. If not,
 * the class name will be "no-cssgradients". This allows for simple
 * if-conditionals in CSS styling, making it easily to have fine
 * control over the look and feel of your website.
 * 
 * @author		Faruk Ates
 * @copyright	 (2009) Faruk Ates.
 *
 * @contributor   Paul Irish
 * @contributor   Ben Alman
 */

window.Modernizr = (function(){
	
	var ret = {},

	/**
	 * enableHTML5 is a private property for advanced use only. If enabled,
	 * it will make Modernizr.init() run through a brief while() loop in
	 * which it will create all HTML5 elements in the DOM to allow for
	 * styling them in Internet Explorer, which does not recognize any
	 * non-HTML4 elements unless created in the DOM this way.
	 * 
	 * enableHTML5 is ON by default.
	 */
	enableHTML5 = true,
	
	/**
	 * enableNoClasses is a private property that, when enabled, will
	 * add classnames to the <body> element at all times, but prefixes
	 * failed groups with "no-", e.g. "no-cssanimations".
	 * This allows for very easy IF / ELSE style rules in your CSS. It
	 * can be disabled if these "no-classes" are not needed or desired.
	 * 
	 * enableNoClasses is ON by default.
	 */
	enableNoClasses = true,
	
	
	/**
	 * fontfaceCheckDelay is the ms delay before the @font-face test is
	 * checked a second time. This is neccessary because both Gecko and
	 * WebKit do not load data: URI font data synchronously.
	 *   https://bugzilla.mozilla.org/show_bug.cgi?id=512566
	 * If you need to query for @font-face support, send a callback to: 
	 *  Modernizr._fontfaceready(fn);
	 * The callback is passed the boolean value of Modernizr.fontface
	 */
	fontfaceCheckDelay = 50,
	
	
	doc = document,
	docElement = doc.documentElement,

	/**
	 * Create our "modernizr" element that we do most feature tests on.
	 */
	m = doc.createElement( 'modernizr' ),
	m_style = m.style,

	/**
	 * Create the input element for various HTML5 feature tests.
	 */
	f = doc.createElement( 'input' ),
	
	// Reused strings.
	
	canvas = 'canvas',
	canvastext = 'canvastext',
	rgba = 'rgba',
	hsla = 'hsla',
	multiplebgs = 'multiplebgs',
	borderimage = 'borderimage',
	borderradius = 'borderradius',
	boxshadow = 'boxshadow',
	opacity = 'opacity',
	cssanimations = 'cssanimations',
	csscolumns = 'csscolumns',
	cssgradients = 'cssgradients',
	cssreflections = 'cssreflections',
	csstransforms = 'csstransforms',
	csstransforms3d = 'csstransforms3d',
	csstransitions = 'csstransitions',
	fontface = 'fontface',
	geolocation = 'geolocation',
	video = 'video',
	audio = 'audio',
	inputtypes = 'inputtypes',
	// inputtypes is a test array of its own containing individual tests for
	// various new input types, such as search, range, datetime, etc.
	
	// SVG is not yet supported in Modernizr 1.0
	// svg = 'svg',
	
	background = 'background',
	backgroundColor = background + 'Color',
	canPlayType = 'canPlayType',
	
	tests = {},
	inputs = {},
	
	elems,
	elem,
	i,
	feature,
	classes = [];
  
 
	/**
	 * set_css applies given styles to the Modernizr DOM node.
	 */
	function set_css( str ) {
		m_style.cssText = str;
	}

	/**
	 * set_css_all extrapolates all vendor-specific css strings.
	 */
	function set_css_all( str1, str2 ) {
		str1 += ';';

		return set_css(
			str1
			+ '-webkit-' + str1
			+ '-moz-' + str1
			+ '-o-' + str1
			+ '-ms-' + str1
			+ ( str2 || '' )
		);
	}

	/**
	 * contains returns a boolean for if substr is found within str.
	 */
	function contains( str, substr ) {
		return str.indexOf( substr ) !== -1;
	}

	/**
	 * test_props is a generic CSS / DOM property test; if a browser supports
	 *   a certain property, it won't return undefined for it.
	 */
	function test_props( props, callback ) {
		for ( var i in props ) {
			if ( m_style[ props[i] ] !== undefined && ( !callback || callback( props[i] ) ) ) {
				return true;
			}
		}
	}

	/**
	 * test_props_all tests a list of DOM properties we want to check against.
	 *   We specify literally ALL possible (known and/or likely) properties on 
	 *   the element including the non-vendor prefixed one, for forward-
	 *   compatibility.
	 */
	function test_props_all( prop, callback ) {
		var uc_prop = prop.replace( /./, function(a) { return a.toUpperCase(); } ),
		props = [
			prop,
			'webkit' + uc_prop,
			'Moz' + uc_prop,
			'moz' + uc_prop,
			'o' + uc_prop,
			'ms' + uc_prop
		];

		return !!test_props( props, callback );
	}


	// Tests

	/**
	 * Canvas tests in Modernizr 1.0 are still somewhat rudimentary. However,
	 *   the added "canvastext" test allows for a slightly more reliable and
	 *   usable setup.
	 */
	tests[canvas] = function() {
		return !!doc.createElement( canvas ).getContext;
	};
	
	tests[canvastext] = function() {
		return !!(tests[canvas]() && typeof doc.createElement( canvas ).getContext('2d').fillText == 'function');
	};

	/**
	 * geolocation tests for the new Geolocation API specification.
	 *   This test is a standards compliant-only test; for more complete
	 *   testing, including a Google Gears fallback, please see:
	 *   http://code.google.com/p/geo-location-javascript/
	 */
	tests[geolocation] = function() {
		return !!navigator.geolocation;
	};

	tests[rgba] = function() {
		// Set an rgba() color and check the returned value
		
		set_css( background + '-color:rgba(150,255,150,.5)' );
		
		return contains( m_style[backgroundColor], rgba );
	};
	
	tests[hsla] = function() {
		// Same as rgba(), in fact, browsers re-map hsla() to rgba() internally
		
		set_css( background + '-color:hsla(120,40%,100%,.5)' );
		
		return contains( m_style[backgroundColor], rgba );
	};
	
	tests[multiplebgs] = function() {
		// Setting multiple images AND a color on the background shorthand property
		//	and then querying the style.background property value for the number of
		//	occurrences of "url(" is a reliable method for detecting ACTUAL support for this!
		
		set_css( background + ':url(m.png),url(a.png),#f99 url(m.png)' );
		
		// If the UA supports multiple backgrounds, there should be three occurrences
		//	of the string "url(" in the return value for elem_style.background
		
		return /(url\s*\(.*?){3}/.test(m_style[background]);
	};
	
	tests[borderimage] = function() {
		set_css_all( 'border-image:url(m.png) 1 1 stretch' );
		
		return test_props_all( 'borderImage' );
	};
	
	tests[borderradius] = function() {
		set_css_all( 'border-radius:10px' );

		return test_props_all( 'borderRadius', '', function( prop ) {
			return contains( prop, 'orderRadius' );
		});
	};
	
	tests[boxshadow] = function() {
		set_css_all( 'box-shadow:#000 1px 1px 3px' );
		
		return test_props_all( 'boxShadow' );
	};
	
	tests[opacity] = function() {
		// Browsers that actually have CSS Opacity implemented have done so
		//	according to spec, which means their return values are within the
		//	range of [0.0,1.0] - including the leading zero.
		
		set_css( 'opacity:.5' );
		
		return contains( m_style[opacity], '0.5' );
	};
	
	tests[cssanimations] = function() {
		set_css_all( 'animation:"animate" 2s ease 2', 'position:relative' );
		
		return test_props_all( 'animationName' );
	};
	
	tests[csscolumns] = function() {
		set_css_all( 'column-count:3' );
		
		return test_props_all( 'columnCount' );
	};
	
	tests[cssgradients] = function() {
		/**
		 * For CSS Gradients syntax, please see:
		 * http://webkit.org/blog/175/introducing-css-gradients/
		 */
		
		var str1 = background + '-image:',
			str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));';
		
		set_css(
				str1 + str2
			+ str1 + '-webkit-' + str2
			+ str1 + '-moz-' + str2
			+ str1 + '-o-' + str2
			+ str1 + '-ms-' + str2
		);
		
		return contains( m_style.backgroundImage, 'gradient' );
	};
	
	tests[cssreflections] = function() {
		set_css_all( 'box-reflect:right 1px' );
		return test_props_all( 'boxReflect' );
	};
	
	tests[csstransforms] = function() {
		set_css_all( 'transform:rotate(3deg)' );
		
		return !!test_props([ 'transformProperty', 'webkitTransform', 'MozTransform', 'mozTransform', 'oTransform', 'msTransform' ]);
	};
	
	tests[csstransforms3d] = function() {
		set_css_all( 'perspective:500' );
		
		return !!test_props([ 'perspectiveProperty', 'webkitPerspective', 'MozPerspective', 'mozPerspective', 'oPerspective', 'msPerspective' ]);
	};
	
	tests[csstransitions] = function() {
		set_css_all( 'transition:all .5s linear' );
		
		return test_props_all( 'transitionProperty' );
	};



	// @font-face detection routine created by Paul Irish - paulirish.com
	// Merged into Modernizr with approval. Read more about Paul's work here:
	// http://paulirish.com/2009/font-face-feature-detection/
  tests[fontface] = (function(){

    var fontret;
    
		// IE supports EOT and has had EOT support since IE 5.
		// This is a proprietary standard (ATOW) and thus this off-spec,
		// proprietary test for it is acceptable. 
    if (!(!/*@cc_on@if(@_jscript_version>=5)!@end@*/0)) fontret = true;
  
    else {
      
      // Create variables for dedicated @font-face test
      var st  = doc.createElement('style'),
        spn = doc.createElement('span'),
        wid, nwid, isFakeBody = false, body = doc.body,
        callback, isCallbackCalled;
  
      // The following is a font-face + glyph definition for the . character:
      st.textContent = "@font-face{font-family:testfont;src:url('data:font/ttf;base64,AAEAAAAMAIAAAwBAT1MvMliohmwAAADMAAAAVmNtYXCp5qrBAAABJAAAANhjdnQgACICiAAAAfwAAAAEZ2FzcP//AAMAAAIAAAAACGdseWYv5OZoAAACCAAAANxoZWFk69bnvwAAAuQAAAA2aGhlYQUJAt8AAAMcAAAAJGhtdHgGDgC4AAADQAAAABRsb2NhAIQAwgAAA1QAAAAMbWF4cABVANgAAANgAAAAIG5hbWUgXduAAAADgAAABPVwb3N03NkzmgAACHgAAAA4AAECBAEsAAUAAAKZAswAAACPApkCzAAAAesAMwEJAAACAAMDAAAAAAAAgAACbwAAAAoAAAAAAAAAAFBmRWQAAAAgqS8DM/8zAFwDMwDNAAAABQAAAAAAAAAAAAMAAAADAAAAHAABAAAAAABGAAMAAQAAAK4ABAAqAAAABgAEAAEAAgAuqQD//wAAAC6pAP///9ZXAwAAAAAAAAACAAAABgBoAAAAAAAvAAEAAAAAAAAAAAAAAAAAAAABAAIAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEACoAAAAGAAQAAQACAC6pAP//AAAALqkA////1lcDAAAAAAAAAAIAAAAiAogAAAAB//8AAgACACIAAAEyAqoAAwAHAC6xAQAvPLIHBADtMrEGBdw8sgMCAO0yALEDAC88sgUEAO0ysgcGAfw8sgECAO0yMxEhESczESMiARDuzMwCqv1WIgJmAAACAFUAAAIRAc0ADwAfAAATFRQWOwEyNj0BNCYrASIGARQGKwEiJj0BNDY7ATIWFX8aIvAiGhoi8CIaAZIoN/43KCg3/jcoAWD0JB4eJPQkHh7++EY2NkbVRjY2RgAAAAABAEH/+QCdAEEACQAANjQ2MzIWFAYjIkEeEA8fHw8QDxwWFhwWAAAAAQAAAAIAAIuYbWpfDzz1AAsEAAAAAADFn9IuAAAAAMWf0i797/8zA4gDMwAAAAgAAgAAAAAAAAABAAADM/8zAFwDx/3v/98DiAABAAAAAAAAAAAAAAAAAAAABQF2ACIAAAAAAVUAAAJmAFUA3QBBAAAAKgAqACoAWgBuAAEAAAAFAFAABwBUAAQAAgAAAAEAAQAAAEAALgADAAMAAAAQAMYAAQAAAAAAAACLAAAAAQAAAAAAAQAhAIsAAQAAAAAAAgAFAKwAAQAAAAAAAwBDALEAAQAAAAAABAAnAPQAAQAAAAAABQAKARsAAQAAAAAABgAmASUAAQAAAAAADgAaAUsAAwABBAkAAAEWAWUAAwABBAkAAQBCAnsAAwABBAkAAgAKAr0AAwABBAkAAwCGAscAAwABBAkABABOA00AAwABBAkABQAUA5sAAwABBAkABgBMA68AAwABBAkADgA0A/tDb3B5cmlnaHQgMjAwOSBieSBEYW5pZWwgSm9obnNvbi4gIFJlbGVhc2VkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgT3BlbiBGb250IExpY2Vuc2UuIEtheWFoIExpIGdseXBocyBhcmUgcmVsZWFzZWQgdW5kZXIgdGhlIEdQTCB2ZXJzaW9uIDMuYmFlYzJhOTJiZmZlNTAzMiAtIHN1YnNldCBvZiBKdXJhTGlnaHRiYWVjMmE5MmJmZmU1MDMyIC0gc3Vic2V0IG9mIEZvbnRGb3JnZSAyLjAgOiBKdXJhIExpZ2h0IDogMjMtMS0yMDA5YmFlYzJhOTJiZmZlNTAzMiAtIHN1YnNldCBvZiBKdXJhIExpZ2h0VmVyc2lvbiAyIGJhZWMyYTkyYmZmZTUwMzIgLSBzdWJzZXQgb2YgSnVyYUxpZ2h0aHR0cDovL3NjcmlwdHMuc2lsLm9yZy9PRkwAQwBvAHAAeQByAGkAZwBoAHQAIAAyADAAMAA5ACAAYgB5ACAARABhAG4AaQBlAGwAIABKAG8AaABuAHMAbwBuAC4AIAAgAFIAZQBsAGUAYQBzAGUAZAAgAHUAbgBkAGUAcgAgAHQAaABlACAAdABlAHIAbQBzACAAbwBmACAAdABoAGUAIABPAHAAZQBuACAARgBvAG4AdAAgAEwAaQBjAGUAbgBzAGUALgAgAEsAYQB5AGEAaAAgAEwAaQAgAGcAbAB5AHAAaABzACAAYQByAGUAIAByAGUAbABlAGEAcwBlAGQAIAB1AG4AZABlAHIAIAB0AGgAZQAgAEcAUABMACAAdgBlAHIAcwBpAG8AbgAgADMALgBiAGEAZQBjADIAYQA5ADIAYgBmAGYAZQA1ADAAMwAyACAALQAgAHMAdQBiAHMAZQB0ACAAbwBmACAASgB1AHIAYQBMAGkAZwBoAHQAYgBhAGUAYwAyAGEAOQAyAGIAZgBmAGUANQAwADMAMgAgAC0AIABzAHUAYgBzAGUAdAAgAG8AZgAgAEYAbwBuAHQARgBvAHIAZwBlACAAMgAuADAAIAA6ACAASgB1AHIAYQAgAEwAaQBnAGgAdAAgADoAIAAyADMALQAxAC0AMgAwADAAOQBiAGEAZQBjADIAYQA5ADIAYgBmAGYAZQA1ADAAMwAyACAALQAgAHMAdQBiAHMAZQB0ACAAbwBmACAASgB1AHIAYQAgAEwAaQBnAGgAdABWAGUAcgBzAGkAbwBuACAAMgAgAGIAYQBlAGMAMgBhADkAMgBiAGYAZgBlADUAMAAzADIAIAAtACAAcwB1AGIAcwBlAHQAIABvAGYAIABKAHUAcgBhAEwAaQBnAGgAdABoAHQAdABwADoALwAvAHMAYwByAGkAcAB0AHMALgBzAGkAbAAuAG8AcgBnAC8ATwBGAEwAAAAAAgAAAAAAAP+BADMAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAQACAQIAEQt6ZXJva2F5YWhsaQ==')}";
      doc.getElementsByTagName('head')[0].appendChild(st);
      
      
      spn.setAttribute('style','font:99px _,serif;position:absolute;visibility:hidden'); 
      
      if  (!body){
        body = docElement.appendChild(doc.createElement(fontface));
        isFakeBody = true;
      } 
      
      // the data-uri'd font only has the . glyph; which is 3 pixels wide.
      spn.innerHTML = '........';
      spn.id        = 'fonttest';
      
      body.appendChild(spn);
      wid = spn.offsetWidth;
      spn.style.font = '99px testfont,_,serif';
      
      // needed for the CSSFontFaceRule false positives (ff3, chrome, op9)
      fontret = wid !== spn.offsetWidth;
      
      var delayedCheck = function(){
        fontret = Modernizr[fontface] = wid !== spn.offsetWidth;
        docElement.className = docElement.className.replace(/(no-)?font.*?\b/,'') + (fontret ? ' ' : ' no-') + fontface;
        
        callback && (isCallbackCalled = true) && callback(fontret);
        isFakeBody && setTimeout(function(){body.parentNode.removeChild(body)}, 50);
      }

      setTimeout(delayedCheck,fontfaceCheckDelay);
    }

    // allow for a callback
    ret._fontfaceready = function(fn){
      (isCallbackCalled || fontret) ? fn(fontret) : (callback = fn);
    }
      
    return function(){ return fontret || wid !== spn.offsetWidth; };
  })();
	
	tests[video] = function() {
		return !!doc.createElement(video)[canPlayType];
	};
	
	tests[audio] = function() {
		return !!doc.createElement(audio)[canPlayType];
	};

	
	// Run through all tests and detect their support in the current UA.
	for ( feature in tests ) {
		if ( tests.hasOwnProperty( feature ) ) {
			classes.push( ( !( ret[ feature ] = tests[ feature ]() ) && enableNoClasses ? 'no-' : '' ) + feature );
		}
	}

	// Run through HTML5's new input types to see if the UA understands any.
	//   This is put behind the tests runloop because it doesn't return a
	//   true/false like all the other tests; instead, it returns an array
	//   containing properties that represent the 'supported' input types.
	ret[inputtypes] = function(props) {
		for ( var i in props ) {
			f.setAttribute('type', props[i]);
			inputs[ props[i] ] = !!( f.type !== 'text');
		}
		return inputs;
	}('search tel url email datetime date month week time datetime-local number range color'.split(' '));


	/**
	 * Reset m.style.cssText to nothing to reduce memory footprint.
	 * Reset tmp, i and prop to null (in case they were used).
	 * 
	 * TODO: explore alternative approach where m.style.cssText is
	 *	   set only once and we extract all data in one fell swoop.
	 *	   Could prove to be a performance improvement.
	 */
	set_css( '' );
	m = f = null;

	// Enable HTML 5 elements for styling in IE:
	if ( enableHTML5 && !(!/*@cc_on!@*/0) ) {
		elems = 'abbr article aside audio bb canvas datagrid datalist details dialog figure footer header mark menu meter nav output progress section time video'.split(' ');

		i = elems.length+1;
		while ( --i ) {
			elem = doc.createElement( elems[i] );
		}
		elem = null;
	}

	// Assign private properties to the return object with prefix
	ret._enableHTML5	 = enableHTML5;
	ret._enableNoClasses = enableNoClasses;

	// Remove "no-js" class from <html> element, if it exists:
	(function(H,C){H[C]=H[C].replace(/\bno-js\b/,'js')})(docElement,'className');

	// Add the new classes to the <html> element.
	docElement.className += ' ' + classes.join( ' ' );

	return ret;

})();
