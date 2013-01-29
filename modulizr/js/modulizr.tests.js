(function(global, doc, fullModernizr, undefined){
  if (global.Modulizr) {
    global.Modulizr.Test = {

      all: function(script, cb) {
        /**
         * In order to not have to test all possible permutation, which would be
         * prohibitively long, we'll test everything individually, and all together.
         * That's a pretty good indicator that anything inbetween will work.
         */

        // Test everything at once!!
        var modules = this._deepCopy(this._modules);
        for(var i in this._features) {
          modules.push(this._features[i]);
        }

        console.log(modules)
        this.ify(Modulizr.ize(script, modules), modules, cb);

        // Then go through each and test
        for (var j in modules) {
          var modList = [modules[j]];
          console.log('-------------------------');
          console.log(modList);
          this.ify(Modulizr.ize(script, modList), modList, cb);
        }
      },

      ify: function(script, modules, cb) {
        var weirdTests = {
         // 'addtest' : function(m){ return ('addTest' in m); },
         // 'shim' : function(m){ return ('_enableHTML5' in m); },
         // 'htmlclasses' : function(){ /* harder, but not impossible, skip for now */ return true; },
         // 'removenojs' : function(){ /* harder, but not impossible, skip for now */ return true; },
         // 'fontface' : function(m){ return ('_fontfaceready' in m); }
        },
        myCb = function(mdzr){
          var results = {};
          for(var i in modules) {
            var modname = modules[i];

            if (!(modname in weirdTests)) {
              if (modname in mdzr && mdzr[modname] === fullModernizr[modname]) {
                results[modname] = true;
              }
              else {
                results[modname] = false;
              }

              // Special cases for audio and video, since they are objects
              if (modname === 'audio' || modname === 'video') {
                for (var j in mdzr[modname]) {
                  if (mdzr[modname][j] === fullModernizr[modname][j]) {
                    results[modname] = true;
                  }
                }
              }
            } else {
              results[modname] = weirdTests[modname].call(this, mdzr, modules);
            }
          }
          cb.call(this, results, mdzr);
        };

        this._runScript(script, myCb);
      },

      _runScript: function(script, cb) {
        (new Function(script)).call(global);
        mdzr = global.Modernizr;
        console.log(mdzr);
        global.Modernizr = undefined;
        cb.call(this, mdzr);
      },

      _deepCopy: function(obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
          var out = [], i = 0, len = obj.length;
          for ( ; i < len; i++ ) {
            out[i] = this._deepCopy(obj[i]);
          }
          return out;
        }
        if (typeof obj === 'object') {
          var out = {}, i;
          for ( i in obj ) {
            out[i] = this._deepCopy(obj[i]);
          }
          return out;
        }
        return obj;
      },
      _modules: [
"flexbox",
"canvas",
"canvastext",
"webgl",
"touchevents",
"pointerevents",
"geolocation",
"postmessage",
"websqldatabase",
"indexeddb",
"hashchange",
"history",
"draganddrop",
"websockets",
"rgba",
"hsla",
"multiplebgs",
"backgroundsize",
"borderimage",
"borderradius",
"boxshadow",
"textshadow",
"opacity",
"cssanimations",
"csscolumns",
"cssgradients",
"cssreflections",
"csstransforms",
"csstransforms3d",
"csstransitions",
"fontface",
"video",
"audio",
"localstorage",
"sessionstorage",
"webworkers",
"applicationcache",
"svg",
"inlinesvg",
"smil",
"svgclippaths"
      ],

      _features: [] //'shim', 'addtest', 'htmlclasses', 'removenojs']

    };
  }
})(this, this.document, this.fullModernizr);
