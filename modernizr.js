/*!
 * Modernizr JavaScript library 0.9.5a
 * http://modernizr.com/
 *
 * Copyright (c) 2009 Faruk Ates
 * Licensed under the MIT license.
 * http://modernizr.com/license/
 *
 * Heavily hacked/optimized by "Cowboy" Ben Alman & Paul Irish
 * http://benalman.com/ http://paulirish.com
 */

/*
 *  Modernizr is a script that will detect various native CSS3 features
 *  available in the current UA and provide an object containing all
 *  features with a true/false value, depending on whether the UA has
 *  native support for it or not.
 *  
 *  In addition to that, Modernizr will add classes to the <body>
 *  element of the page, one for each cutting-edge feature. If the UA
 *  supports it, a class like "cssgradients" will be added. If not,
 *  the class name will be "no-cssgradients". This allows for simple
 *  if-conditionals in CSS styling, making it easily to have fine
 *  control over the look and feel of your website.
 *  
 *  @author     Faruk Ates
 *  @copyright  (2009) Faruk Ates.
 */

window.Modernizr = (function(){
  
  var ret = {},
    
    /**
     *  enableHTML5 is a private property for advanced use only. If enabled,
     *  it will make Modernizr.init() run through a brief while() loop in
     *  which it will create all HTML5 elements in the DOM to allow for
     *  styling them in Internet Explorer, which does not recognize any
     *  non-HTML4 elements unless created in the DOM this way.
     *  
     *  enableHTML5 is ON by default.
     */
    enableHTML5 = true,
    
    /**
     *  enableNoClasses is a private property that, when enabled, will
     *  add classnames to the <body> element at all times, but prefixes
     *  failed groups with "no-", e.g. "no-cssanimations".
     *  This allows for very easy IF / ELSE style rules in your CSS. It
     *  can be disabled if these "no-classes" are not needed or desired.
     *  
     *  enableNoClasses is ON by default.
     */
    enableNoClasses = true,
    
    doc = document,
    
    /**
     *  Create our "modernizr" element that we do all feature tests on.
     */
     
    m = doc.createElement( 'modernizr' ),
    m_style = m.style,
    
    // Reused strings.
    
    canvas = 'canvas',
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
    csstransitions = 'csstransitions',
    // The following are not (yet) supported in Modernizr
    // fontface = 'fontface',
    // svg = 'svg',
    // overflowxy = 'overflowxy',
    
    background = 'background',
    backgroundColor = background + 'Color',
    
    tests = {},
    
    elems,
    elem,
    i,
    feature,
    classes = [];
  
 
	/**
	 *  set_css just applies given styles to the DOM node
	 */
  function set_css( str ) {
    m_style.cssText = str;
  };

	/**
	 *  set_css_all extrapolates all vendor-specific css strings
	 */
  
  function set_css_all( str1, str2 ) {
    str1 += ';'
    
    return set_css(
        str1
      + '-webkit-' + str1
      + '-moz-' + str1
      + '-o-' + str1
      + '-ms-' + str1
      + ( str2 || '' )
    );
  };
  
	/**
	 *  contains returns a boolean for if substr is found within str
	 */
  function contains( str, substr ) {
    return str.indexOf( substr ) !== -1;
  };
  
    

  function test_props( props, callback ) {
    for ( var i in props ) {
      if ( m_style[ props[i] ] !== undefined && ( !callback || callback( props[i] ) ) ) {
        return true;
      }
    }
  };
  
	/**
	 * test_props_all tests a list of DOM properties we want to check against. 
   * We specify literally ALL possible (known and/or likely) properties on 
   * the element including the non-vendor prefixed one, for forward compatibility.
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
    
    return test_props( props, callback );
  };
  
  
  
  // Tests
  
  /**
   *  The CANVAS check is very rudimentary in this version. It will
   *  be expanded upon in a future release to more reliably and
   *  accurately represent the UA's full support for CANVAS.
   */
  tests[canvas] = function() {
    return !!doc.createElement( canvas ).getContext;
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
    // Setting multiple images and a color on the background shorthand property
    //  and then querying the style.background property value for the number of
    //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!
    
    set_css( background + ':url(m.png),url(a.png),#f99 url(m.png)' );
    
    // If the UA supports multiple backgrounds, there should be three occurrences
    //  of the string "url(" in the return value for elem_style.background
    
    var matches = m_style[background].match( /url\(/g );
    return matches && matches.length == 3;
  };
  
  tests[borderimage] = function() {
    set_css_all( 'border-image:url(m.png) 1 1 stretch' );
    
    return test_props_all( 'borderImage' );
  };
  
  tests[borderradius] = function() {
    set_css_all( 'border-radius:10px' );
    
    return test_props_all( 'borderTopRightRadius', '', function( prop ) {
      return contains( prop, 'orderTopRight' );
    });
  };
  
  tests[boxshadow] = function() {
    set_css_all( 'box-shadow:#000 1px 1px 3px' );
    
    return test_props_all( 'boxShadow' );
  };
  
  tests[opacity] = function() {
    // Browsers that actually have CSS Opacity implemented have done so
    //  according to spec, which means their return values are within the
    //  range of [0.0,1.0] - including the leading zero.
    
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
     *  For CSS Gradients syntax, please see:
     *  http://webkit.org/blog/175/introducing-css-gradients/
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
    
    return test_props([ 'transformProperty', 'webkitTransform', 'MozTransform', 'mozTransform', 'oTransform', 'msTransform' ]);
  };
  
  tests[csstransitions] = function() {
    set_css_all( 'transition:all .5s linear' );
    
    return test_props_all( 'transitionProperty' );
  };
  
  /*
  tests[fontface] function() {

  };
  
  tests[svg] = function() {

  };
  
  tests[overflowxy] = function() {

  };
  */
  
  // Run through all tests and detect their support in the current UA.
  for ( feature in tests ) {
    if ( tests.hasOwnProperty( feature ) ) {
      classes.push( ( !( ret[ feature ] = tests[ feature ]() ) && enableNoClasses ? 'no-' : '' ) + feature );
    }
  }
  
	/**
	 *  Reset m.style.cssText to nothing to reduce memory footprint.
	 *  Reset tmp, i and prop to null (in case they were used).
	 *  
	 *  TODO: explore alternative approach where m.style.cssText is
	 *        set only once and we extract all data in one fell swoop.
	 *        Could prove to be a performance improvement.
	 */
  set_css( '' );
  m = null;
  
  // Enable HTML 5 elements for styling in IE?
  if ( enableHTML5 && !(!/*@cc_on!@*/0) ) {
    elems = 'abbr article aside audio bb canvas datagrid datalist details dialog figure footer header mark menu meter nav output progress section time video'.split(' ');
    
    i = elems.length;
    while ( i-- ) {
      elem = doc.createElement( elems[i] );
    }
    
    elem = null;
  }
  
  // Assign private properties to the return object with prefix
  ret._enableHTML5     = enableHTML5;
  ret._enableNoClasses = enableNoClasses;
  
  // Add the classes to the <body> element.
  doc.body.className += ' ' + classes.join( ' ' );
  
  return ret;
  
})();