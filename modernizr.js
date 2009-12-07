/*!
 * Modernizr JavaScript library 1.1
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
 * In addition to that, Modernizr will add classes to the <html>
 * element of the page, one for each cutting-edge feature. If the UA
 * supports it, a class like "cssgradients" will be added. If not,
 * the class name will be "no-cssgradients". This allows for simple
 * if-conditionals in CSS styling, making it easily to have fine
 * control over the look and feel of your website.
 * 
 * @author    Faruk Ates
 * @copyright   (2009) Faruk Ates.
 *
 * @contributor   Paul Irish
 * @contributor   Ben Alman
 */

window.Modernizr = (function(window,doc){
    
    var version = '1.1',
    
    ret = {},

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
     * add classnames to the <html> element at all times, but prefixes
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
    fontfaceCheckDelay = 100,
    
    
    docElement = doc.documentElement,

    /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    m = doc.createElement( 'modernizr' ),
    m_style = m.style,

    /**
     * Create the input element for various Web Forms feature tests.
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
    input = 'input',
    inputtypes = input + 'types',
    // inputtypes is an object of its own containing individual tests for
    // various new input types, such as search, range, datetime, etc.
    
    // SVG is not yet supported in Modernizr
    // svg = 'svg',
    
    background = 'background',
    backgroundColor = background + 'Color',
    canPlayType = 'canPlayType',
    localStorage = 'localstorage',
    sessionStorage = 'sessionstorage',
    webWorkers = 'webworkers',
    applicationCache = 'applicationcache',
    
    // list of property values to set for css tests. see ticket #21
    setProperties = ' -o- -moz- -ms- -webkit- '.split(' '),

    tests = {},
    inputs = {},
    attrs = {},
    
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
        return set_css(setProperties.join(str1 + ';') + ( str2 || '' ));
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
     *   A supported CSS property returns empty string when its not yet set.
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
        var uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1),
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
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!
        
        set_css( background + ':url(m.png),url(a.png),#f99 url(m.png)' );
        
        // If the UA supports multiple backgrounds, there should be three occurrences
        //  of the string "url(" in the return value for elem_style.background
        
        return /(url\s*\(.*?){3}/.test(m_style[background]);
    };
    
    
    // In testing support for a given CSS property, it's legit to test:
    //    elem.style[styleName] !== undefined
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.
    // We'll take advantage of this quick test and skip setting a style 
    // on our modernizr element, but instead just testing undefined vs
    // empty string.
    // The legacy set_css_all calls will remain in the source 
    // (however, commented) in for clarity, yet functionally they are 
    // no longer needed.
    
    tests[borderimage] = function() {
        //  set_css_all( 'border-image:url(m.png) 1 1 stretch' );
        
        return test_props_all( 'borderImage' );
    };
    
    tests[borderradius] = function() {
        //  set_css_all( 'border-radius:10px' );

        return test_props_all( 'borderRadius', '', function( prop ) {
            return contains( prop, 'orderRadius' );
        });
    };
    
    tests[boxshadow] = function() {
        //  set_css_all( 'box-shadow:#000 1px 1px 3px' );
        
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
        //  set_css_all( 'animation:"animate" 2s ease 2', 'position:relative' );
        
        return test_props_all( 'animationName' );
    };
    
    tests[csscolumns] = function() {
        //  set_css_all( 'column-count:3' );
        
        return test_props_all( 'columnCount' );
    };
    
    tests[cssgradients] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * http://webkit.org/blog/175/introducing-css-gradients/
         * https://developer.mozilla.org/en/CSS/-moz-linear-gradient
         * https://developer.mozilla.org/en/CSS/-moz-radial-gradient
         * http://dev.w3.org/csswg/css3-images/#gradients-
         */
        
        var str1 = background + '-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';
        
        set_css(
                str1 + str2
            + str1 + '-webkit-' + str2
            + str1 + '-moz-' + str2
            + str1 + '-o-' + str2
            + str1 + '-ms-' + str2
            + str1 + str3
            + str1 + '-webkit-' + str3
            + str1 + '-moz-' + str3
            + str1 + '-o-' + str3
            + str1 + '-ms-' + str3
        );
        
        return contains( m_style.backgroundImage, 'gradient' );
    };
    
    tests[cssreflections] = function() {
        //  set_css_all( 'box-reflect:right 1px' );
        return test_props_all( 'boxReflect' );
    };
    
    tests[csstransforms] = function() {
        //  set_css_all( 'transform:rotate(3deg)' );
        
        return !!test_props([ 'transformProperty', 'webkitTransform', 'MozTransform', 'mozTransform', 'oTransform', 'msTransform' ]);
    };
    
    tests[csstransforms3d] = function() {
        //  set_css_all( 'perspective:500' );
        
        return !!test_props([ 'perspectiveProperty', 'webkitPerspective', 'MozPerspective', 'mozPerspective', 'oPerspective', 'msPerspective' ]);
    };
    
    tests[csstransitions] = function() {
        //  set_css_all( 'transition:all .5s linear' );
        
        return test_props_all( 'transitionProperty' );
    };



    // @font-face detection routine created by Paul Irish - paulirish.com
    // Merged into Modernizr with approval. Read more about Paul's work here:
    // http://paulirish.com/2009/font-face-feature-detection/  
    tests[fontface] = (function(){

        var fontret;
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
            fontret = ret[fontface] = wid !== spn.offsetWidth;
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
    

    
    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // we're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // codec values from : http://www.w3.org/TR/html5/video.html#the-source-element
    //                     http://www.ietf.org/rfc/rfc4281.txt
    
    tests[video] = function() {
        var elem = doc.createElement(video),
            bool = !!elem[canPlayType];
        
        if (bool){  
            bool      = new Boolean(bool);  
            bool.ogg  = elem[canPlayType]('video/ogg; codecs="theora, vorbis"');
            bool.h264 = elem[canPlayType]('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
        }
        return bool;
    };
    
    tests[audio] = function() {
        var elem = doc.createElement(audio),
            bool = !!elem[canPlayType];
        
        if (bool){  
            bool      = new Boolean(bool);  
            bool.ogg  = elem[canPlayType]('audio/ogg; codecs="vorbis"');
            bool.mp3  = elem[canPlayType]('audio/mpeg3;');
            
            // mimetypes accepted: 
            //   https://developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
            //   http://developer.apple.com/safari/library/documentation/appleapplications/reference/SafariWebContent/CreatingContentforSafarioniPhone/CreatingContentforSafarioniPhone.html#//apple_ref/doc/uid/TP40006482-SW7
            bool.wav  = elem[canPlayType]('audio/wav; codecs="1"');
            bool.m4a  = elem[canPlayType]('audio/x-m4a;');
        }
        return bool;
    };

    // both localStorage and sessionStorage are
    // tested in this method because otherwise Firefox will
    //   throw an error: https://bugzilla.mozilla.org/show_bug.cgi?id=365772
    // if cookies are disabled
    tests[localStorage] = function() {
        return 'localStorage' in window;
    };

    tests[sessionStorage] = function() {
        return 'sessionStorage' in window;
    };

    tests[webWorkers] = function () {
        return !!window.Worker;
    };

    tests[applicationCache] =  function() {
        return !!window.applicationCache;
    };
 

    // Run through all tests and detect their support in the current UA.
    for ( feature in tests ) {
        if ( tests.hasOwnProperty( feature ) ) {
            classes.push( ( !( ret[ feature ] = tests[ feature ]() ) && enableNoClasses ? 'no-' : '' ) + feature );
        }
    }

    /**
     * Addtest allows the user to define their own feature tests
     * the result will be added onto the Modernizr object,
     * as well as an appropriate className set on the html element
     * 
     * @param feature - String naming the feature
     * @param test - Function returning true if feature is supported, false if not
     */
    ret.addTest = function (feature, test) {
      if (this.hasOwnProperty( feature )) {
        // warn that feature test is already present
      } 
      test = !!(test());
      docElement.className += ' ' + (!test && enableNoClasses ? 'no-' : '') + feature; 
      ret[ feature ] = test;
    };
    
    // Run through HTML5's new input attributes to see if the UA understands any.
    // We're using f which is the <input> element created early on
    // Mike Taylr has created a comprehensive resource for testing these attributes
    //   when applied to all input types: 
    //   http://miketaylr.com/code/input-type-attr.html
    // spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
    ret[input] = (function(props) {
        for ( var i in props ) {
            attrs[ props[i] ] = !!(props[i] in f);
        }
        return attrs;
    })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));

    // Run through HTML5's new input types to see if the UA understands any.
    //   This is put behind the tests runloop because it doesn't return a
    //   true/false like all the other tests; instead, it returns an object
    //   containing each input type with its corresponding true/false value 
    ret[inputtypes] = (function(props) {
        for ( var i in props ) {
            f.setAttribute('type', props[i]);
            inputs[ props[i] ] = !!( f.type !== 'text');
        }
        return inputs;
    })('search tel url email datetime date month week time datetime-local number range color'.split(' '));


    /**
     * Reset m.style.cssText to nothing to reduce memory footprint.
     */
    set_css( '' );
    m = f = null;

    // Enable HTML 5 elements for styling in IE:
    if ( enableHTML5 && !(!/*@cc_on!@*/0) ) {
        elems = 'abbr article aside audio canvas datalist details eventsource figure footer header hgroup mark menu meter nav output progress section time video'.split(' ');

        i = elems.length+1;
        while ( --i ) {
            elem = doc.createElement( elems[i] );
        }
        elem = null;
    }

    // Assign private properties to the return object with prefix
    ret._enableHTML5     = enableHTML5;
    ret._enableNoClasses = enableNoClasses;
    ret._version         = version;

    // Remove "no-js" class from <html> element, if it exists:
    (function(H,C){H[C]=H[C].replace(/\bno-js\b/,'js')})(docElement,'className');

    // Add the new classes to the <html> element.
    docElement.className += ' ' + classes.join( ' ' );
    
    return ret;

})(this,this.document);
