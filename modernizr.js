/*!
 * Modernizr JavaScript library 1.5
 * http://www.modernizr.com/
 *
 * Copyright (c) 2009-2010 Faruk Ates - http://farukat.es/
 * Dual-licensed under the BSD and MIT licenses.
 * http://www.modernizr.com/license/
 *
 * Featuring major contributions by
 * Paul Irish  - http://paulirish.com
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
 * @author        Faruk Ates
 * @copyright     (c) 2009-2010 Faruk Ates.
 *
 * @contributor   Paul Irish
 * @contributor   Ben Alman
 */

window.Modernizr = (function(window,doc,undefined){
    
    var version = '1.5',
    
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
    
    
    docElement = doc.documentElement,

    /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    mod = 'modernizr',
    m = doc.createElement( mod ),
    m_style = m.style,

    /**
     * Create the input element for various Web Forms feature tests.
     */
    f = doc.createElement( 'input' ),
    
    smile = ':)',
    
    tostring = Object.prototype.toString,
    
    // list of property values to set for css tests. see ticket #21
    prefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),

    tests = {},
    inputs = {},
    attrs = {},
    
    classes = [],
    
    /**
      * isEventSupported determines if a given element supports the given event
      * function from http://yura.thinkweb2.com/isEventSupported/
      */
    isEventSupported = (function(){

      var TAGNAMES = {
        'select':'input','change':'input',
        'submit':'form','reset':'form',
        'error':'img','load':'img','abort':'img'
      };

      function isEventSupported(eventName, element) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = (eventName in element);

        if (!isSupported) {
          // if it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
          if (!element.setAttribute) {
            element = document.createElement('div');
          }
          if (element.setAttribute && element.removeAttribute) {
            element.setAttribute(eventName, '');
            isSupported = typeof element[eventName] == 'function';

            // if property was created, "remove it" (by setting value to `undefined`)
            if (typeof element[eventName] != 'undefined') {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })();
    
    
    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    var _hasOwnProperty = ({}).hasOwnProperty, hasOwnProperty;
    if (typeof _hasOwnProperty !== 'undefined' && typeof _hasOwnProperty.call !== 'undefined') {
      hasOwnProperty = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProperty = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && typeof object.constructor.prototype[property] === 'undefined');
      };
    }
    
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
        return set_css(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    /**
     * contains returns a boolean for if substr is found within str.
     */
    function contains( str, substr ) {
        return (''+str).indexOf( substr ) !== -1;
    }

    /**
     * test_props is a generic CSS / DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     *   A supported CSS property returns empty string when its not yet set.
     */
    function test_props( props, callback ) {
        for ( var i in props ) {
            
            // required for IE9 pp4
            //   connect.microsoft.com/IE/feedback/details/583669/elem-style-mstransform-throws-an-error
            //   github.com/Modernizr/Modernizr/issues#issue/60
            try { 
              m_style[ props[i] ] !== undefined
            } catch(e){
              continue;
            }
            // ^^ remove when IE9 beta comes out (assuming they fix the bug)
          
            if ( m_style[ props[i] ] !== undefined && ( !callback || callback( props[i], m ) ) ) {
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
        
        // following spec is to expose vendor-specific style properties as:
        //   elem.style.WebkitBorderRadius
        // and the following would be incorrect:
        //   elem.style.webkitBorderRadius
        
        // Webkit ghosts their properties in lowercase but Opera & Moz do not.
        // Microsoft foregoes prefixes entirely <= IE8, but appears to 
        //   use a lowercase `ms` instead of the correct `Ms` in IE9
        
        // see more here: http://github.com/Modernizr/Modernizr/issues/issue/21
        props = [
            prop,
            'Webkit' + uc_prop,
            'Moz' + uc_prop,
            'O' + uc_prop,
            'ms' + uc_prop,
            'Khtml' + uc_prop
        ];

        return !!test_props( props, callback );
    }
    

    /**
     * Tests
     */

    tests['flexbox'] = function() {
        /**
         * set_prefixed_value_css sets the property of a specified element
         * adding vendor prefixes to the VALUE of the property.
         * @param {Element} element
         * @param {string} property The property name. This will not be prefixed.
         * @param {string} value The value of the property. This WILL be prefixed.
         * @param {string=} extra Additional CSS to append unmodified to the end of
         * the CSS string.
         */
        function set_prefixed_value_css(element, property, value, extra) {
            property += ':';
            element.style.cssText = (property + prefixes.join(value + ';' + property)).slice(0, -property.length) + (extra || '');
        }

        /**
         * set_prefixed_property_css sets the property of a specified element
         * adding vendor prefixes to the NAME of the property.
         * @param {Element} element
         * @param {string} property The property name. This WILL be prefixed.
         * @param {string} value The value of the property. This will not be prefixed.
         * @param {string=} extra Additional CSS to append unmodified to the end of
         * the CSS string.
         */
        function set_prefixed_property_css(element, property, value, extra) {
            element.style.cssText = prefixes.join(property + ':' + value + ';') + (extra || '');
        }

        var c = doc.createElement('div'),
            elem = doc.createElement('div');

        set_prefixed_value_css(c, 'display', 'box', 'width:42px;padding:0;');
        set_prefixed_property_css(elem, 'box-flex', '1', 'width:10px;');

        c.appendChild(elem);
        docElement.appendChild(c);

        var ret = elem.offsetWidth === 42;

        c.removeChild(elem);
        docElement.removeChild(c);

        return ret;
    };
    
    // On the S60 and BB Storm, getContext exists, but always returns undefined
    // http://github.com/Modernizr/Modernizr/issues/issue/97/ 
    
    tests['canvas'] = function() {
        var elem = doc.createElement( 'canvas' );
        return !!(elem.getContext && elem.getContext('2d'));
    };
    
    tests['canvastext'] = function() {
        return !!(ret['canvas'] && typeof doc.createElement( 'canvas' ).getContext('2d').fillText == 'function');
    };
    
    /**
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     * Additionally, chrome used to lie about its support on this, but that 
     *    has since been recitifed: http://crbug.com/36415
     * Because there is no way to reliably detect Chrome's false positive 
     *    without UA sniffing we have removed this test from Modernizr. We 
     *    hope to add it in after Chrome 5 has been sunsetted. 
     * See also http://github.com/Modernizr/Modernizr/issues#issue/84
     
    tests[touch] = function() {

        return !!('ontouchstart' in window);
        
    };
    */

    /**
     * geolocation tests for the new Geolocation API specification.
     *   This test is a standards compliant-only test; for more complete
     *   testing, including a Google Gears fallback, please see:
     *   http://code.google.com/p/geo-location-javascript/
     * or view a fallback solution using google's geo API:
     *   http://gist.github.com/366184
     */
    tests['geolocation'] = function() {
        return !!navigator.geolocation;
    };

    tests['crosswindowmessaging'] = function() {
      return !!window.postMessage;
    };

    // in chrome incognito mode, openDatabase is truthy, but using it
    //   will throw an exception: http://crbug.com/42380
    // we create a dummy database. there is no way to delete it afterwards. sorry. 
    tests['websqldatabase'] = function() {
      var result = !!window.openDatabase;
      if (result){
        try {
          result = !!openDatabase( mod + "testdb", "1.0", mod + "testdb", 2e4);
        } catch(e) {
          result = false;
        }
      }
      return result;
    };
    
    tests['indexedDB'] = function(){
      return !!window.indexedDB;
    };

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && ( document.documentMode === undefined || document.documentMode > 7 );
    };

    tests['historymanagement'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        return  isEventSupported('drag') && 
                isEventSupported('dragstart') && 
                isEventSupported('dragenter') &&
                isEventSupported('dragover') &&
                isEventSupported('dragleave') &&
                isEventSupported('dragend') &&
                isEventSupported('drop');
    };

    
    tests['websockets'] = function(){
        return ('WebSocket' in window);
    };
    
    
    // http://css-tricks.com/rgba-browser-support/
    tests['rgba'] = function() {
        // Set an rgba() color and check the returned value
        
        set_css(  'background-color:rgba(150,255,150,.5)' );
        
        return contains( m_style.backgroundColor, 'rgba' );
    };
    
    tests['hsla'] = function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally..
        //   except IE9 who retains it as hsla
        
        set_css('background-color:hsla(120,40%,100%,.5)' );
        
        return contains( m_style.backgroundColor, 'rgba' ) || contains( m_style.backgroundColor, 'hsla' );
    };
    
    tests['multiplebgs'] = function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!
        
        set_css( 'background:url(//:),url(//:),red url(//:)' );
        
        // If the UA supports multiple backgrounds, there should be three occurrences
        //  of the string "url(" in the return value for elem_style.background

        return new RegExp("(url\\s*\\(.*?){3}").test(m_style.background);
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
    

    tests['backgroundsize'] = function() {
        return test_props_all( 'backgroundSize' );
    };
    
    tests['borderimage'] = function() {
        //  set_css_all( 'border-image:url(m.png) 1 1 stretch' );
        return test_props_all( 'borderImage' );
    };
    
    
    // super comprehensive table about all the unique implementations of 
    // border-radius: http://muddledramblings.com/table-of-css3-border-radius-compliance
    
    tests['borderradius'] = function() {
        //  set_css_all( 'border-radius:10px' );
        return test_props_all( 'borderRadius', '', function( prop ) {
            return contains( prop, 'orderRadius' );
        });
    };
    
    
    tests['boxshadow'] = function() {
        //  set_css_all( 'box-shadow:#000 1px 1px 3px' );
        return test_props_all( 'boxShadow' );
    };
    
    
    tests['opacity'] = function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.
        
        set_css_all( 'opacity:.5' );
        
        return contains( m_style.opacity, '0.5' );
    };
    
    
    tests['cssanimations'] = function() {
        //  set_css_all( 'animation:"animate" 2s ease 2', 'position:relative' );
        return test_props_all( 'animationName' );
    };
    
    
    tests['csscolumns'] = function() {
        //  set_css_all( 'column-count:3' );
        return test_props_all( 'columnCount' );
    };
    
    
    tests['cssgradients'] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * http://webkit.org/blog/175/introducing-css-gradients/
         * https://developer.mozilla.org/en/CSS/-moz-linear-gradient
         * https://developer.mozilla.org/en/CSS/-moz-radial-gradient
         * http://dev.w3.org/csswg/css3-images/#gradients-
         */
        
        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';
        
        set_css(
            (str1 + prefixes.join(str2 + str1) + prefixes.join(str3 + str1)).slice(0,-str1.length)
        );
        
        return contains( m_style.backgroundImage, 'gradient' );
    };
    
    
    tests['cssreflections'] = function() {
        //  set_css_all( 'box-reflect:right 1px' );
        return test_props_all( 'boxReflect' );
    };
    
    
    tests['csstransforms'] = function() {
        //  set_css_all( 'transform:rotate(3deg)' );
        return !!test_props([ 'transformProperty', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform' ]);
    };
    
    
    tests['csstransforms3d'] = function() {
        //  set_css_all( 'perspective:500' );
        
        var ret = !!test_props([ 'perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective' ]);
        
        // webkit has 3d transforms disabled for chrome, though
        //   it works fine in safari on leopard and snow leopard
        // as a result, it 'recognizes' the syntax and throws a false positive
        // thus we must do a more thorough check:
        if (ret){
            var st = document.createElement('style'),
                div = doc.createElement('div');
                
            // webkit allows this media query to succeed only if the feature is enabled.    
            // "@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d),(modernizr){#modernizr{height:3px}}"
            st.textContent = '@media ('+prefixes.join('transform-3d),(')+'modernizr){#modernizr{height:3px}}';
            doc.getElementsByTagName('head')[0].appendChild(st);
            div.id = 'modernizr';
            docElement.appendChild(div);
            
            ret = div.offsetHeight === 3;
            
            st.parentNode.removeChild(st);
            div.parentNode.removeChild(div);
        }
        return ret;
    };
    
    
    tests['csstransitions'] = function() {
        //  set_css_all( 'transition:all .5s linear' );
        return test_props_all( 'transitionProperty' );
    };


    // @font-face detection routine by Diego Perini
    // http://javascript.nwbox.com/CSSSupport/
    tests['fontface'] = function(){

        var 
        sheet,
        head = doc.head || doc.getElementsByTagName('head')[0] || docElement,
        style = doc.createElement("style"),
        impl = doc.implementation || { hasFeature: function() { return false; } };
        
        style.type = 'text/css';
        head.insertBefore(style, head.firstChild);
        sheet = style.sheet || style.styleSheet;

        // removing it crashes IE browsers
        //head.removeChild(style);

        var supportAtRule = impl.hasFeature('CSS2', '') ?
                function(rule) {
                    if (!(sheet && rule)) return false;
                    var result = false;
                    try {
                        sheet.insertRule(rule, 0);
                        result = !(/unknown/i).test(sheet.cssRules[0].cssText);
                        sheet.deleteRule(sheet.cssRules.length - 1);
                    } catch(e) { }
                    return result;
                } :
                function(rule) {
                    if (!(sheet && rule)) return false;
                    sheet.cssText = rule;
                    
                    return sheet.cssText.length !== 0 && !(/unknown/i).test(sheet.cssText) &&
                      sheet.cssText
                            .replace(/\r+|\n+/g, '')
                            .indexOf(rule.split(' ')[0]) === 0;
                };


        // DEPRECATED - allow for a callback
        ret._fontfaceready = function(fn){
          fn(ret.fontface);
        };
        
        return supportAtRule('@font-face { font-family: "font"; src: "font.ttf"; }');
        
    };
    

    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // we're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // codec values from : http://github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan
    
    // note: in FF 3.5.1 and 3.5.0, "no" was a return value instead of empty string.
    //   Modernizr does not normalize for that.
    
    tests['video'] = function() {
        var elem = doc.createElement('video'),
            bool = !!elem.canPlayType;
        
        if (bool){  
            bool      = new Boolean(bool);  
            bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"');
            
            // workaround required for ie9, who doesn't report video support without audio codec specified.
            //   bug 599718 @ msft connect
            var h264 = 'video/mp4; codecs="avc1.42E01E';
            bool.h264 = elem.canPlayType(h264 + '"') || elem.canPlayType(h264 + ', mp4a.40.2"');
            
            bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"');
        }
        return bool;
    };
    
    tests['audio'] = function() {
        var elem = doc.createElement('audio'),
            bool = !!elem.canPlayType;
        
        if (bool){  
            bool      = new Boolean(bool);  
            bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"');
            bool.mp3  = elem.canPlayType('audio/mpeg;');
            
            // mimetypes accepted: 
            //   https://developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
            //   http://bit.ly/iphoneoscodecs
            bool.wav  = elem.canPlayType('audio/wav; codecs="1"');
            bool.m4a  = elem.canPlayType('audio/x-m4a;') || elem.canPlayType('audio/aac;');
        }
        return bool;
    };


    // both localStorage and sessionStorage are
    // tested via the `in` operator because otherwise Firefox will
    //   throw an error: https://bugzilla.mozilla.org/show_bug.cgi?id=365772
    // if cookies are disabled
    
    // they require try/catch because of possible firefox configuration:
    //   http://github.com/Modernizr/Modernizr/issues#issue/92
    
    // FWIW miller device resolves to [object Storage] in all supporting browsers
    //   except for IE who does [object Object]
    
    // IE8 Compat mode supports these features completely:
    //   http://www.quirksmode.org/dom/html5.html
    
    tests['localstorage'] = function() {
        try {
          return ('localStorage' in window) && window.localStorage !== null;
        } catch(e) {
          return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            return ('sessionStorage' in window) && window.sessionStorage !== null;
        } catch(e){
            return false;
        }
    };


    tests['webWorkers'] = function () {
        return !!window.Worker;
    };


    tests['applicationcache'] =  function() {
        var cache = window.applicationCache;
        return !!(cache && (typeof cache.status != 'undefined') && (typeof cache.update == 'function') && (typeof cache.swapCache == 'function'));
    };

 
    // thanks to Erik Dahlstrom
    tests['svg'] = function(){
        return !!doc.createElementNS && !!doc.createElementNS( "http://www.w3.org/2000/svg", "svg").createSVGRect;
    };
    
    // thanks to F1lt3r and lucideer
    // http://github.com/Modernizr/Modernizr/issues#issue/35
    tests['smil'] = function(){
        return !!doc.createElementNS && /SVG/.test(tostring.call(doc.createElementNS('http://www.w3.org/2000/svg','animate')));
    };

    tests['svgclippaths'] = function(){
        // returns a false positive in saf 3.2?
        return !!doc.createElementNS && /SVG/.test(tostring.call(doc.createElementNS('http://www.w3.org/2000/svg','clipPath')));
    };


    // input features and input types go directly onto the ret object, bypassing the tests loop.
    // hold this guy to execute in a moment.
    function webforms(){
    
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types: 
        //   http://miketaylr.com/code/input-type-attr.html
        // spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
        ret['input'] = (function(props) {
            for (var i = 0,len=props.length;i<len;i++) {
                attrs[ props[i] ] = !!(props[i] in f);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));

        // Run through HTML5's new input types to see if the UA understands any.
        //   This is put behind the tests runloop because it doesn't return a
        //   true/false like all the other tests; instead, it returns an object
        //   containing each input type with its corresponding true/false value 
        
        // Big thx to @miketaylr for the html5 forms expertise. http://miketaylr.com/
        ret['inputtypes'] = (function(props) {
            for (var i = 0,bool,len=props.length;i<len;i++) {
                f.setAttribute('type', props[i]);
                bool = f.type !== 'text';
                
                // chrome likes to falsely purport support, so we feed it a textual value
                // if that doesnt succeed then we know there's a custom UI
                if (bool){  

                    f.value = smile;
     
                    if (/^range$/.test(f.type) && f.style.WebkitAppearance !== undefined){
                      
                      docElement.appendChild(f);
                      
                      // Safari 2-4 allows the smiley as a value, despite making a slider
                      bool =  doc.defaultView.getComputedStyle && 
                              doc.defaultView.getComputedStyle(f, null).WebkitAppearance !== 'textfield' && 
                      
                              // mobile android web browser has false positive, so must
                              // check the height to see if the widget is actually there.
                              (f.offsetHeight !== 0);
                              
                      docElement.removeChild(f);
                              
                    } else if (/^(search|tel)$/.test(f.type)){
                      // spec doesnt define any special parsing or detectable UI 
                      //   behaviors so we pass these through as true
                      
                      // interestingly, opera fails the earlier test, so it doesn't
                      //  even make it here.
                      
                    } else if (/^(url|email)$/.test(f.type)) {

                      // real url and email support comes with prebaked validation.
                      bool = f.checkValidity && f.checkValidity() === false;
                      
                    } else {
                      // if the upgraded input compontent rejects the :) text, we got a winner
                      bool = f.value != smile;
                    }
                }
                
                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));

    }



    // end of test definitions


    // Run through all tests and detect their support in the current UA.
    // todo: hypothetically we could be doing an array of tests and use a basic loop here.
    for ( var feature in tests ) {
        if ( hasOwnProperty( tests, feature ) ) {
            // run the test, throw the return value into the Modernizr,
            //   then based on that boolean, define an appropriate className
            //   and push it into an array of classes we'll join later.
            classes.push( ( ( ret[ feature.toLowerCase() ] = tests[ feature ]() ) ?  '' : 'no-' ) + feature.toLowerCase() );
        }
    }
    
    // input tests need to run.
    if (!ret.input) webforms();
    

   



    /**
     * Addtest allows the user to define their own feature tests
     * the result will be added onto the Modernizr object,
     * as well as an appropriate className set on the html element
     * 
     * @param feature - String naming the feature
     * @param test - Function returning true if feature is supported, false if not
     */
    ret.addTest = function (feature, test) {
      feature = feature.toLowerCase();
      
      if (ret[ feature ]) {
        return; // quit if you're trying to overwrite an existing test
      } 
      test = !!(test());
      docElement.className += ' ' + (test ? '' : 'no-') + feature; 
      ret[ feature ] = test;
      return ret; // allow chaining.
    };

    /**
     * Reset m.style.cssText to nothing to reduce memory footprint.
     */
    set_css( '' );
    m = f = null;

    // Enable HTML 5 elements for styling in IE. 
    // fyi: jscript version does not reflect trident version
    //      therefore ie9 in ie7 mode will still have a jScript v.9
    if ( enableHTML5 && (function(){ var elem = doc.createElement("div");
                                      elem.innerHTML = "<elem></elem>";
                                      return elem.childNodes.length !== 1; })()) {
        // iepp v1.5.1 MIT @jon_neal  http://code.google.com/p/ie-print-protector/
        (function(p,e){function q(a,b){if(g[a])g[a].styleSheet.cssText+=b;else{var c=r[l],d=e[j]("style");d.media=a;c.insertBefore(d,c[l]);g[a]=d;q(a,b)}}function s(a,b){for(var c=new RegExp("\\b("+m+")\\b(?!.*[;}])","gi"),d=function(k){return".iepp_"+k},h=-1;++h<a.length;){b=a[h].media||b;s(a[h].imports,b);q(b,a[h].cssText.replace(c,d))}}function t(){for(var a,b=e.getElementsByTagName("*"),c,d,h=new RegExp("^"+m+"$","i"),k=-1;++k<b.length;)if((a=b[k])&&(d=a.nodeName.match(h))){c=new RegExp("^\\s*<"+d+"(.*)\\/"+d+">\\s*$","i");i.innerHTML=a.outerHTML.replace(/\r|\n/g," ").replace(c,a.currentStyle.display=="block"?"<div$1/div>":"<span$1/span>");c=i.childNodes[0];c.className+=" iepp_"+d;c=f[f.length]=[a,c];a.parentNode.replaceChild(c[1],c[0])}s(e.styleSheets,"all")}function u(){for(var a=-1,b;++a<f.length;)f[a][1].parentNode.replaceChild(f[a][0],f[a][1]);for(b in g)r[l].removeChild(g[b]);g={};f=[]}for(var r=e.documentElement,i=e.createDocumentFragment(),g={},m="abbr|article|aside|audio|canvas|command|datalist|details|figure|figcaption|footer|header|hgroup|keygen|mark|meter|nav|output|progress|section|source|summary|time|video",n=m.split("|"),f=[],o=-1,l="firstChild",j="createElement";++o<n.length;){e[j](n[o]);i[j](n[o])}i=i.appendChild(e[j]("div"));p.attachEvent("onbeforeprint",t);p.attachEvent("onafterprint",u)})(this,doc);
    }

    // Assign private properties to the return object with prefix
    ret._enableHTML5     = enableHTML5;
    ret._version         = version;

    // Remove "no-js" class from <html> element, if it exists:
    docElement.className=docElement.className.replace(/\bno-js\b/,'') + ' js';

    // Add the new classes to the <html> element.
    docElement.className += ' ' + classes.join( ' ' );
    
    return ret;

})(this,this.document);
    
