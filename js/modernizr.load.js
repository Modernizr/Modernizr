/**
 * yepnope.js 1.0 RC1
 * Alex Sexton & Ralph Holzmann
 * WTFPL BSD & MIT
*/
( function ( window, doc, undef ) {

var docElement            = doc.documentElement,
    sTimeout              = window.setTimeout,
    docFirst              = doc.getElementsByTagName( 'head' )[ 0 ],
    toString              = {}.toString,
    execStack             = [],
    started               = 0,
    // Before you get mad about browser sniffs, please read:
    // https://github.com/Modernizr/Modernizr/wiki/Undetectables
    // If you have a better solution, we are actively looking to solve the problem
    isGecko               = ( 'MozAppearance' in docElement.style ),
    isGecko18             = isGecko && !! window.Event.prototype.preventBubble,
    // Thanks to @jdalton for showing us this opera detection (by way of @kangax) (and probably @miketaylr too, or whatever...)
    isOpera               = window.opera && toString.call( window.opera ) == '[object Opera]',
    isWebkit              = ( 'webkitAppearance' in docElement.style ),
    strJsElem             = isOpera || ( isGecko && ! isGecko18 ) ? 'img' : ( isGecko ? 'object' : 'script' ),
    strCssElem            = isWebkit ? 'img' : strJsElem,
    isArray               = Array.isArray || function ( obj ) {
      return toString.call( obj ) == '[object Array]';
    },
    isObject              = function ( obj ) {
      // Lame object detection, but don't pass it stupid stuff?
      return typeof obj == 'object';
    },
    isString              = function ( s ) {
      return typeof s == 'string';
    },
    isFunction            = function ( fn ) {
      return toString.call( fn ) == '[object Function]';
    },
    globalFilters         = [],
    prefixes              = {},
    handler,
    yepnope;

  /* Loader helper functions */
  function isFileReady ( readyState ) {
    // Check to see if any of the ways a file can be ready are available as properties on the file's element
    return ( ! readyState || readyState == 'loaded' || readyState == 'complete' );
  }

  function execWhenReady () {
    var execStackReady = 1,
        i              = -1;

    // Loop through the stack of scripts in the cue and execute them when all scripts in a group are ready
    while ( execStack.length - ++i ) {
      if ( execStack[ i ].s && ! ( execStackReady = execStack[ i ].r ) ) {
        // As soon as we encounter a script that isn't ready, stop looking for more
        break;
      }
    }
    // If we've set the stack as ready in the loop, make it happen here
    if ( execStackReady ) {
      executeStack();
    }
  }

  // Takes a preloaded js obj (changes in different browsers) and injects it into the head
  // in the appropriate order
  function injectJs ( oldObj ) {
    var script = doc.createElement( 'script' ),
        done;

    script.src = oldObj.s;

    // Bind to load events
    script.onreadystatechange = script.onload = function () {

      if ( ! done && isFileReady( script.readyState ) ) {

        // Set done to prevent this function from being called twice.
        done = 1;
        execWhenReady();

        // Handle memory leak in IE
        script.onload = script.onreadystatechange = null;
        // Only remove it if we appended it to begin with
        ! oldObj.e && docElement.removeChild( script );
      }
    };

    // 404 Fallback
    sTimeout( function () {
      if ( ! done ) {
        done = 1;
        docElement.removeChild( script );
        execWhenReady();
      }
    }, yepnope.errorTimeout );

    // Inject script into to document
    // or immediately callback if we know there
    // was previously a timeout error
    if ( oldObj.e ) {
      script.onload();
    }
    else {
      docElement.appendChild( script );
    }
  }

  // Takes a preloaded css obj (changes in different browsers) and injects it into the head
  // in the appropriate order
  // Many credits to John Hann (@unscriptable) for a lot of the ideas here - found in the css! plugin for RequireJS
  function injectCss ( oldObj ) {

    // Create stylesheet link
    var link = doc.createElement( 'link' ),
        done;

    // Add attributes
    link.href = oldObj.s;
    link.rel  = 'stylesheet';
    link.type = 'text/css';

    // Poll for changes in webkit and gecko
    if ( isWebkit || isGecko ) {

      // A self executing function with a sTimeout poll to call itself
      // again until the css file is added successfully
      ( function poll ( link ) {
        sTimeout( function () {
          // Don't run again if we're already done
          if ( ! done ) {
            try {
              // In supporting browsers, we can see the length of the cssRules of the file go up
              if ( link.sheet && link.sheet.cssRules && link.sheet.cssRules.length ) {
                // Then turn off the poll
                done = 1;
                // And execute a function to execute callbacks when all dependencies are met
                execWhenReady();
              }
              // otherwise, wait another interval and try again
              else {
                poll( link );
              }
            }
            catch ( ex ) {
              // In the case that the browser does not support the cssRules array (cross domain)
              // just check the error message to see if it's a security error
              if ( ( ex.code == 1e3 ) || ( ex.message.match( /security|denied/i ) ) ) {
                // if it's a security error, that means it loaded a cross domain file, so stop the timeout loop
                done = 1;
                // and execute a check to see if we can run the callback(s) immediately after this function ends
                sTimeout( function () {
                  execWhenReady();
                }, 0 );
              }
              // otherwise, continue to poll
              else {
                poll( link );
              }
            }
          }
        }, 0 );
      } )( link );

    }
    // Onload handler for IE and Opera
    else {
      // In browsers that allow the onload event on link tags, just use it
      link.onload = function () {
        if ( ! done ) {
          // Set our flag to complete
          done = 1;
          // Check to see if we can call the callback
          sTimeout( function () {
            execWhenReady();
          }, 0 );
        }
      };
    }

    // 404 Fallback
    sTimeout( function () {
      if ( ! done ) {
        done = 1;
        docElement.removeChild( link );
        execWhenReady();
      }
    }, yepnope.errorTimeout );

    // Inject CSS
    docElement.insertBefore( link, docFirst );
  }

  function executeStack ( a ) {
    // shift an element off of the stack
    var i   = execStack.shift(),
        src = i ? i.s  : undef,
        t   = i ? i.t : undef;

    started = 1;

    // if a is truthy and the first item in the stack has an src
    if ( a && src ) {
      // Pop another off the stack
      i = execStack.shift();
      // unset the src
      src = undef;
    }

    if ( i ) {
      // if it's a script, inject it into the head with no type attribute
      if ( src && t == 'j' ) {
        // Inject after a timeout so FF has time to be a jerk about it and
        // not double load (ignore the cache)
        sTimeout( function () {
          injectJs( i );
        }, 0 );
      }
      // If it's a css file, fun the css injection function
      else if ( src && t == 'c' ) {
        injectCss( i );
      }
      // Otherwise, just call the function and potentially run the stack
      // reset the started flag for the recursive handling
      else {
        i();
        started = 0;
        execWhenReady();
      }
    }
    else {
      // just reset out of recursive mode
      started = 0;
    }
  }

  function preloadFile ( elem, url, type, splicePoint, docElement ) {

    // Create appropriate element for browser and type
    var preloadElem = doc.createElement( elem ),
        done        = 0,
        stackObject = {
          t: type,  // type
          s: url    // src
        //r: 0      // ready
        //e: 0      // error
        };

    function onload () {

      // If the script/css file is loaded
      if ( ! done && isFileReady( preloadElem.readyState ) ) {

        // Set done to prevent this function from being called twice.
        stackObject.r = done = 1;

        ! started && execWhenReady();

        // Handle memory leak in IE
        preloadElem.onload = preloadElem.onreadystatechange = null;
        docElement.removeChild( preloadElem );
      }
    }

    // Just set the src and the data attributes so we don't have differentiate between elem types
    preloadElem.src = preloadElem.data = url;

    // Don't let it show up visually
    preloadElem.width = preloadElem.height = '0';

    // Only if we have a type to add should we set the type attribute (a real script has no type)
    if ( elem != 'object' ) {
      preloadElem.type = type;
    }

    // Attach handlers for all browsers
    preloadElem.onload = preloadElem.onreadystatechange = onload;

    // If it's an image
    if ( elem == 'img' ) {
      // Use the onerror callback as the 'completed' indicator
      preloadElem.onerror = onload;
    }
    // Otherwise, if it's a script element
    else if ( elem == 'script' ) {
      // handle errors on script elements when we can
      preloadElem.onerror = function () {
        stackObject.r = 1;
        executeStack( 1 );
      };
    }

    // inject the element into the stack depending on if it's
    // in the middle of other scripts or not
    execStack.splice( splicePoint, 0, stackObject );

    // append the element to the appropriate parent element (scripts go in the head, usually, and objects go in the body usually)
    docElement.appendChild( preloadElem );

    // Special case for opera, since error handling is how we detect onload
    // we can't have a real error handler. So in opera, we
    // have a timeout in order to throw an error if something never loads.
    // Better solutions welcomed.
    if ( ( isOpera && elem == 'script' ) || elem == 'object' ) {
      sTimeout( function () {
        if ( ! done ) {
          // Remove the node from the dom
          docElement.removeChild( preloadElem );
          // Set it to ready to move on
          // indicate that this had a timeout error on our stack object
          stackObject.r = stackObject.e = done = 1;
          // Continue on
          execWhenReady();
        }
      }, yepnope.errorTimeout );
    }
  }

  function load ( resource, type ) {

    var elem  = ( type == 'c' ? strCssElem : strJsElem );

    // We'll do 'j' for js and 'c' for css, yay for unreadable minification tactics
    type = type || 'j';
    if ( isString( resource ) ) {
      // if the resource passed in here is a string, preload the file
      // use the head when we can (which is the documentElement when the head element doesn't exist)
      // and use the body element for objects. Images seem fine in the head, for some odd reason.
      preloadFile( elem, resource, type, this.i++, docElement );
    } else {
      // Otherwise it's a resource object and we can splice it into the app at the current location
      execStack.splice( this.i++, 0, resource );
    }

    // OMG is this jQueries? For chaining...
    return this;
  }

  // return the yepnope object with a fresh loader attached
  function getYepnope () {
    var y = yepnope;
    y.loader = {
      load: load,
      i : 0
    };
    return y;
  }

  /* End loader helper functions */
    // Yepnope Function
  yepnope = function ( needs ) {

    var i,
        need,
        // start the chain as a plain instance
        chain = this.yepnope.loader;

    function satisfyPrefixes ( url ) {
      // split all prefixes out
      var parts   = url.split( '!' ),
      gLen    = globalFilters.length,
      origUrl = parts.pop(),
      pLen    = parts.length,
      res     = {
        url      : origUrl,
        // keep this one static for callback variable consistency
        origUrl  : origUrl,
        prefixes : parts
      },
      mFunc,
      j;

      // loop through prefixes
      // if there are none, this automatically gets skipped
      for ( j = 0; j < pLen; j++ ) {
        mFunc = prefixes[ parts[ j ] ];
        if ( mFunc ) {
          res = mFunc( res );
        }
      }

      // Go through our global filters
      for ( j = 0; j < gLen; j++ ) {
        res = globalFilters[ j ]( res );
      }

      // return the final url
      return res;
    }

    function loadScriptOrStyle ( input, callback, chain, index, testResult ) {
      // run through our set of prefixes
      var resource     = satisfyPrefixes( input ),
          autoCallback = resource.autoCallback;

      // if no object is returned or the url is empty/0 just exit the load
      if ( resource.bypass ) {
        return;
      }

      // Determine callback, if any
      if ( callback ) {
        callback = isFunction( callback ) ? callback : callback[ input ] || callback[ index ] || callback[ ( input.split( '/' ).pop().split( '?' )[ 0 ] ) ];
      }

      // if someone is overriding all normal functionality
      if ( resource.instead ) {
        return resource.instead( input, callback, chain, index, testResult );
      }
      else {

        chain.load( resource.url, ( ( resource.forceCSS || ( ! resource.forceJS && /css$/.test( resource.url ) ) ) ) ? 'c' : undef );

        // If we have a callback, we'll start the chain over
        if ( isFunction( callback ) || isFunction( autoCallback ) ) {
          // Call getJS with our current stack of things
          chain.load( function () {
            // Hijack yepnope and restart index counter
            getYepnope();
            // Call our callbacks with this set of data
            callback && callback( resource.origUrl, testResult, index );
            autoCallback && autoCallback( resource.origUrl, testResult, index );
          } );
        }
      }
    }

    function loadFromTestObject ( testObject, chain) {
        var testResult = !! testObject.test,
            group      = testResult ? testObject.yep : testObject.nope,
            always     = testObject.load || testObject.both,
            callback   = testObject.callback,
            callbackKey;

        // Reusable function for dealing with the different input types
        // NOTE:: relies on closures to keep 'chain' up to date, a bit confusing, but
        // much smaller than the functional equivalent in this case.
        function handleGroup ( needGroup ) {
          // If it's a string
          if ( isString( needGroup ) ) {
            // Just load the script of style
            loadScriptOrStyle( needGroup, callback, chain, 0, testResult );
          }
          // See if we have an object. Doesn't matter if it's an array or a key/val hash
          // Note:: order cannot be guaranteed on an key value object with multiple elements
          // since the for-in does not preserve order. Arrays _should_ go in order though.
          else if ( isObject( needGroup ) ) {
            for ( callbackKey in needGroup ) {
              // Safari 2 does not have hasOwnProperty, but not worth the bytes for a shim
              // patch if needed. Kangax has a nice shim for it. Or just remove the check
              // and promise not to extend the object prototype.
              if ( needGroup.hasOwnProperty( callbackKey ) ) {
                loadScriptOrStyle( needGroup[ callbackKey ], callback, chain, callbackKey, testResult );
              }
            }
          }
        }

        // figure out what this group should do
        handleGroup( group );

        // Run our loader on the load/both group too
        handleGroup( always );

        // Fire complete callback
        if ( testObject.complete ) {
          chain.load( testObject.complete );
        }

    }

    // Someone just decides to load a single script or css file as a string
    if ( isString( needs ) ) {
      loadScriptOrStyle( needs, 0, chain, 0 );
    }
    // Normal case is likely an array of different types of loading options
    else if ( isArray( needs ) ) {
      // go through the list of needs
      for( i = 0; i < needs.length; i++ ) {
        need = needs[ i ];

        // if it's a string, just load it
        if ( isString( need ) ) {
          loadScriptOrStyle( need, 0, chain, 0 );
        }
        // if it's an array, call our function recursively
        else if ( isArray( need ) ) {
          yepnope( need );
        }
        // if it's an object, use our modernizr logic to win
        else if ( isObject( need ) ) {
          loadFromTestObject( need, chain );
        }
      }
    }
    // Allow a single object to be passed in
    else if ( isObject( needs ) ) {
      loadFromTestObject( needs, chain );
    }
  };

  // This publicly exposed function is for allowing
  // you to add functionality based on prefixes on the
  // string files you add. 'css!' is a builtin prefix
  //
  // The arguments are the prefix (not including the !) as a string
  // and
  // A callback function. This function is passed a resource object
  // that can be manipulated and then returned. (like middleware. har.)
  //
  // Examples of this can be seen in the officially supported ie prefix
  yepnope.addPrefix = function ( prefix, callback ) {
    prefixes[ prefix ] = callback;
  };

  // A filter is a global function that every resource
  // object that passes through yepnope will see. You can
  // of course conditionally choose to modify the resource objects
  // or just pass them along. The filter function takes the resource
  // object and is expected to return one.
  //
  // The best example of a filter is the 'autoprotocol' officially
  // supported filter
  yepnope.addFilter = function ( filter ) {
    globalFilters.push( filter );
  };

  // Default error timeout to 10sec - modify to alter
  yepnope.errorTimeout = 10000;

  // Webreflection readystate hack
  // safe for jQuery 1.4+ ( i.e. don't use yepnope with jQuery 1.3.2 )
  // if the readyState is null and we have a listener
  if ( doc.readyState == null && doc.addEventListener ) {
    // set the ready state to loading
    doc.readyState = 'loading';
    // call the listener
    doc.addEventListener( 'DOMContentLoaded', handler = function () {
      // Remove the listener
      doc.removeEventListener( 'DOMContentLoaded', handler, 0 );
      // Set it to ready
      doc.readyState = 'complete';
    }, 0 );
  }

  // Attach loader &
  // Leak it
  window.yepnope = yepnope = getYepnope();

} )( this, this.document );
