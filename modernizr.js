/*!
 * Modernizr JavaScript library 0.9
 * http://modernizr.com/
 *
 * Copyright (c) 2009 Faruk Ates
 * Licensed under the MIT license.
 * http://modernizr.com/license/
 *
 * Date: 2009-06-10 15:00:51 -0800 (Wed, 10 Jun 2009)
 */
/**
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
var Modernizr = (function() {

	/**
	   tests is a private property containing a list of all tests in the
	   *  current Modernizr release. Setting their value to "false" will
	   *  disable that particular test. This is not recommended as that
	   *  will also remove the test's result from the returned Modernizr
	   *  JavaScript object.
	 */
	var tests = {
		'canvas': true,           // VERY rudimentary
		'rgba': true,
		'hsla': true,
		'multiplebgs': true,
		'borderimage': true,
		'borderradius': true,
		'boxshadow': true,
		'opacity': true,
		'cssanimations': true,
		'csscolumns': true,       // VERY rudimentary
		'cssgradients': true,
		'cssreflections': true,
		'csstransforms': true,
		'csstransitions': true
		// The following are not (yet) supported in Modernizr
		// 'fontface': false,
		// 'svg': false,
		// 'overflowxy': false
	};

	/**
	   passed is a private property that will be populated with all the
	   *  tests in Modernizr that the UA has passed. It is used
	   *  internally to avoid executing the detectFeature() method
	   *  unnecessarily.
	 */
	var passed = {};

	/**
		groups is a private property that maps feature tests to a class
		*  name to be added to the <body> element. By default, Modernizr
		*  only maps all features 1:1 to a class name, but this can be
		*  customized if desired. The key in the groups object property
		*  is the name being added to the <body>, and the value is a list
		*  containing one or more features from the tests property above.
		*  
		*  Only if ALL of the features from the list are supported by the
		*  browser will the name be added as a class.
	 */
	var groups = {
		'canvas': ['canvas'],
		'rgba': ['rgba'],
		'hsla': ['hsla'],
		'multiplebgs': ['multiplebgs'],
		'borderimage': ['borderimage'],
		'borderradius': ['borderradius'],
		'boxshadow': ['boxshadow'],
		'opacity': ['opacity'],
		'cssanimations': ['cssanimations'],
		'csscolumns': ['csscolumns'],
		'cssgradients': ['cssgradients'],
		'cssreflections': ['cssreflections'],
		'csstransforms': ['csstransforms'],
		'csstransitions': ['csstransitions']
	};

	/**
	 *  enableHTML5 is a private property for advanced use only. If enabled,
	 *  it will make Modernizr.init() run through a brief while() loop in
	 *  which it will create all HTML5 elements in the DOM to allow for
	 *  styling them in Internet Explorer, which does not recognize any
	 *  non-HTML4 elements unless created in the DOM this way.
	 *  
	 *  enableHTML5 is ON by default.
	 */
	var enableHTML5 = true;
	
	/**
	 *  enableNoClasses is a private property that, when enabled, will
	 *  add classnames to the <body> element at all times, but prefixes
	 *  failed groups with "no-", e.g. "no-cssanimations".
	 *  This allows for very easy IF / ELSE style rules in your CSS. It
	 *  can be disabled if these "no-classes" are not needed or desired.
	 *  
	 *  enableNoClasses is ON by default.
	 */
	var enableNoClasses = true;

	/**
	 *  Create our "modernizr" element that we do all feature tests on.
	 */
	var m = document.createElement('modernizr');

	/** 
	 *  detectFeature is a private method that runs a test against a
	 *  specific feature to see if the browser supports and correctly
	 *  processes the feature.
	 *  
	 *  @param {string} feat Name of the feature to test
	 *  @returns TRUE if the given feature is supported by the current UA
	 *  @type Boolean
	 */
	var detectFeature = function(feat) {

		// Declare the variables used along the way.
		var supported = false, prop, i, tmp;

		switch(feat) {
			/**
			 *  The CANVAS check is very rudimentary in this version. It will
			 *  be expanded upon in a future release to more reliably and
			 *  accurately represent the UA's full support for CANVAS.
			 */
			case 'canvas':
				supported = !!document.createElement('canvas').getContext;
				break;

			case 'rgba':
				// Set an rgba() color and check the returned value
				m.style.cssText = "background-color: rgba(150,255,150, .5)";
				supported = !!(m.style.backgroundColor.indexOf('rgba') !== -1);
				break;

			case 'hsla':
				// Same as rgba(), in fact, browsers re-map hsla() to rgba() internally
				m.style.cssText = "background-color: hsla(120,40%,100%, .5)";
				supported = !!(m.style.backgroundColor.indexOf('rgba') !== -1);
				break;

			case 'multiplebgs':
				// Setting multiple images and a color on the background shorthand property
				//  and then querying the style.background property value for the number of
				//  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!
				m.style.cssText = "background: url(m.png), url(a.png), #f99 url(m.png);";
			
				// If the UA supports multiple backgrounds, there should be three occurrences
				//  of the string "url(" in the return value for elem.style.background
				tmp = m.style.background;
				i = 0;
				while (tmp.indexOf('url(') !== -1) {
					i++;
					tmp = tmp.substring(0, tmp.indexOf('url(')) + tmp.substring(tmp.indexOf('url(') + 4);
				}
				// If i==3 then the UA handled this correctly.
				supported = !!(i === 3);
				tmp = i = null;
				break;

			case 'borderimage':
				// 'prop" is a list of DOM properties we want to check against. We specify
				//  literally ALL possible (known and/or likely) properties on the element
				//  including the non-vendor prefixed one, for forward compatibility.
				prop = ['borderImage', 'webkitBorderImage', 'MozBorderImage', 'mozBorderImage', 'oBorderImage', 'msBorderImage'];
				m.style.cssText = "border-image: url(m.png) 1 1 stretch; -webkit-border-image: url(m.png) 1 1 stretch; -moz-border-image: url(m.png) 1 1 stretch; -o-border-image: url(m.png) 1 1 stretch; -ms-border-image: url(m.png) 1 1 stretch;";

				// Loop through all possible properties and see if we get a valid response at all
				for (i in prop) {
					if (m.style[prop[i]] !== undefined) {
						supported = true;
						break;
					}
				}
				break;

			case 'borderradius':
				/**
				 *  See border-image for the explanations on the prop variable and the for loop
				 */
				prop = ['borderTopRightRadius', 'webkitBorderTopRightRadius', 'MozBorderTopRightRadius', 'mozBorderTopRightRadius', 'oBorderTopRightRadius', 'msBorderTopRightRadius'];
				m.style.cssText = "border-top-right-radius: 10px; -webkit-border-top-right-radius: 10px; -moz-border-top-right-radius: 10px; -o-border-top-right-radius: 10px; -ms-border-top-right-radius: 10px;"; // -moz-border-radius-topright: 10px;

				for (i in prop) {
					if (m.style[prop[i]] !== undefined && prop[i].indexOf("orderTopRight") !== -1) {
						supported = true;
						break;
					}
				}
				break;

			case 'boxshadow':
				/**
				 *  See border-image for the explanations on the prop variable and the for loop
				 */
				prop = ['boxShadow', 'webkitBoxShadow', 'MozBoxShadow', 'mozBoxShadow', 'oBoxShadow', 'msBoxShadow'];
				m.style.cssText = "box-shadow: #000 1px 1px 3px; -webkit-box-shadow: #000 1px 1px 3px; -moz-box-shadow: #000 1px 1px 3px; -obox-shadow: #000 1px 1px 3px; -ms-box-shadow: #000 1px 1px 3px;";

				for (i in prop) {
					if (m.style[prop[i]] !== undefined) {
						supported = true;
						break;
					}
				}
				break;

			case 'opacity':
				// Browsers that actually have CSS Opacity implemented have done so
				//  according to spec, which means their return values are within the
				//  range of [0.0,1.0] - including the leading zero.
				m.style.cssText = "opacity: .5;";
				supported = !!(m.style.opacity.indexOf('0.5') !== -1);
				break;

			case 'cssanimations':
				/**
				 *  See border-image for the explanations on the prop variable and the for loop
				 */
				prop = ['animationName', 'webkitAnimationName', 'MozAnimationName', 'mozAnimationName', 'oAnimationName', 'msAnimationName'];
				m.style.cssText = "animation: 'animate' 2s ease 2; -webkit-animation: 'animate' 2s ease 2; -moz-animation: 'animate' 2s ease 2; -o-animation: 'animate' 2s ease 2; -ms-animation: 'animate' 2s ease 2; position:relative;";

				for (i in prop) {
					if (m.style[prop[i]] !== undefined) {
						supported = true;
						break;
					}
				}
				break;

			case 'csscolumns':
				/**
				 *  See border-image for the explanations on the prop variable and the for loop
				 */
				prop = ['columnCount', 'webkitColumnCount', 'MozColumnCount', 'mozColumnCount', 'oColumnCount', 'msColumnCount'];
				m.style.cssText = "column-count: 3; -webkit-column-count: 3; -moz-column-count: 3; -o-column-count: 3; -ms-column-count: 3;";

				for (i in prop) {
					if (m.style[prop[i]] !== undefined) {
						supported = true;
						break;
					}
				}
				break;

			case 'cssgradients':
				/**
				 *  For CSS Gradients syntax, please see:
				 *  http://webkit.org/blog/175/introducing-css-gradients/
				 */
				m.style.cssText = "background-image: gradient(linear, left top, right bottom, from(#9f9), to(white)); background-image: -webkit-gradient(linear, left top, right bottom, from(#9f9), to(white)); background-image: -moz-gradient(linear, left top, right bottom, from(#9f9), to(white)); background-image: -o-gradient(linear, left top, right bottom, from(#9f9), to(white)); background-image: -ms-gradient(linear, left top, right bottom, from(#9f9), to(white));";
				supported = !!(m.style.backgroundImage.indexOf('gradient') !== -1);
				break;

			case 'cssreflections':
				/**
				 *  See border-image for the explanations on the prop variable and the for loop
				 */
				prop = ['boxReflect', 'webkitBoxReflect', 'MozBoxReflect', 'mozBoxReflect', 'oBoxReflect', 'msBoxReflect'];
				m.style.cssText = "box-reflect: right 1px; -webkit-box-reflect: right 1px; -moz-box-reflect: right 1px; -o-box-reflect: right 1px; -ms-box-reflect: right 1px;";

				for (i in prop) {
					if (m.style[prop[i]] !== undefined) {
						supported = true;
						break;
					}
				}
				break;

			case 'csstransforms':
				/**
				 *  See border-image for the explanations on the prop variable and the for loop
				 */
				prop = ['transformProperty', 'webkitTransform', 'MozTransform', 'mozTransform', 'oTransform', 'msTransform'];
				m.style.cssText = "transform: rotate(3deg); -webkit-transform: rotate(3deg); -moz-transform: rotate(3deg); -o-transform: rotate(3deg); -ms-transform: rotate(3deg);";

				for (i in prop) {
					if (m.style[prop[i]] !== undefined) {
						supported = true;
						break;
					}
				}
				break;

			case 'csstransitions':
				/**
				 *  See border-image for the explanations on the prop variable and the for loop
				 */
				prop = ['transitionProperty', 'webkitTransitionProperty', 'MozTransitionProperty', 'mozTransitionProperty', 'oTransitionProperty', 'msTransitionProperty'];
				m.style.cssText = "transition: all .5s linear; -webkit-transition: all .5s linear; -moz-transition: all .5s linear; -o-transition: all .5s linear; -ms-transition: all .5s linear;";

				for (i in prop) {
					if (m.style[prop[i]] !== undefined) {
						supported = true;
						break;
					}
				}
				break;
		
			default:
				supported = false;
		}

		/**
		 *  Reset m.style.cssText to nothing to reduce memory footprint.
		 *  Reset tmp, i and prop to null (in case they were used).
		 *  
		 *  TODO: explore alternative approach where m.style.cssText is
		 *        set only once and we extract all data in one fell swoop.
		 *        Could prove to be a performance improvement.
		 */
		m.style.cssText = "";
		tmp = i = prop = null;

		// Return whether the feature is supported or not.
		return supported;
	};

	/**
	   init is a private method which initializes Modernizr and tests
	   *  your current UA against the enabled CSS3 features and adds
	   *  each passed group as a classname to the <body> element.
	   *  
	   *  @returns "Modernizr" object containing all tests' results
	   *  @type OBJECT
	 */
	function init() {

		// Enable HTML 5 elements for styling in IE?
		if (enableHTML5 && !(!/*@cc_on!@*/0)) {
			var e = 'abbr article aside audio bb canvas datagrid datalist details dialog figure footer header mark menu meter nav output progress section time video'.split(' '), i=e.length;
			var n;
			while (i--){
				n = document.createElement(e[i]);
			}
			n = null;
		}
		
		/**
		 *  Run through all tests and detect their support in the current UA.
		 */
		for (var feat in tests) {
			if (tests[feat]) {
				passed[feat] = detectFeature(feat);
			}
		}

		// Variables we'll use
		var passedgroup, len;
		var classes = [];

		for (var group in groups) {

			// Assume the group is true (= passes test) unless we encounter a failure, at which point we break
			passedgroup = true;

			// Loop through the groups
			for (i=0, len=groups[group].length; i<len; i++) {

				// Assign the group name to feat
				feat = groups[group][i];

				// If the current feature is not supported, fail group and break
				if (!passed[feat]) {
					passedgroup = false;
					if (!enableNoClasses) {
						break;
					}
				}
			}

			// Add group to classes array
			if (passedgroup) {
				classes.push(group);
			
			// if enableNoClasses, add group on failure with "no-" prefix
			} else if (enableNoClasses) {
				classes.push("no-" + group);
			}
		}

		// Assign private properties to the return object with prefix
		passed._enableHTML5         = enableHTML5;
		passed._enableNoClasses     = enableNoClasses;
		
		// Add the classes to the <body> element, unset "classes"
		document.getElementsByTagName('body')[0].className += " " + classes.join(' ');
		classes = null;

		// return the object; will get assigned to var Modernizr
		return passed;

	} // init

	return init();

})();
