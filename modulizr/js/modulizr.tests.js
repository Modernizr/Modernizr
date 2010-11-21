(function(global, doc, undefined){
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
          'addtest' : function(m){ return ('addTest' in m); },
          'shim' : function(m){ return ('_enableHTML5' in m); },
          'htmlclasses' : function(){ /* harder, but not impossible, skip for now */ return true; },
          'removenojs' : function(){ /* harder, but not impossible, skip for now */ return true; },
          'fontface' : function(m){ return ('_fontfaceready' in m); }
        },
        myCb = function(mdzr){
          var results = {};
          for(var i in modules) {
            var modname = modules[i];
            
            if (!(modname in weirdTests)) {
              if (modname in mdzr) {
                results[modname] = true;
              }
              else {
                results[modname] = false;
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
      
      _modules: ['fontface', 'canvas', 'canvastext', 'audio', 'video', 'rgba', 'hsla', 'borderimage', 'borderradius',
                'boxshadow', 'opacity', 'multiplebgs', 'cssanimations', 'csscolumns', 'cssgradients', 'cssreflections',
                'csstransforms', 'csstransforms3d', 'csstransitions', 'geolocation', 'localstorage', 'sessionstorage',
                'svg', 'smil', 'svgclippaths','draganddrop', 'hashchange', 'crosswindowmessaging', 'historymanagement',
                'applicationcache', 'websockets', 'webworkers', 'websqldatabase', 'indexeddb', 'inputtypes', 'input'],
      
      _features: ['shim', 'addtest', 'htmlclasses', 'removenojs']
      
    };
  }
})(this, this.document);