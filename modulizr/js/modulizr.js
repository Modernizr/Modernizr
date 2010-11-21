/**
 * Modulizr
 * Modernizr Modular Build Tool
 * Very simple tool for including or excluding tests
 * 
 * @Author  Alex Sexton - AlexSexton@gmail.com
 * @License Dual MIT and WTFPL
 */

/**
 * This section does the conditional build
 */
(function(global){
  var Modulizr = {
    /**
     * Function ize
     *
     * @argument source  {string} The marked up original source
     * @argument modules {array}  An array of strings that match identifiers in the source
     *
     * @returns {string} The new source with only the requested modules
     */
    ize: function(source, modules){
      // Variables for string manipulation and saving
      var strings = [],
      sid = '_' + ( + new Date());
      
      source = this._removeComments(source);

      // remove string literals
      var js_nostr = source.replace(/("|')((?:\\\1|.)+?)\1/g, function($0) {
      	strings[strings.length] = $0;
      	return sid;
      });

      // filter each block
      console.log(js_nostr);

      // put the strings back where they belong!
      var parsed = js_nostr.replace(RegExp(sid, 'g'), function() {
      	return strings.shift();
      });
      
      return parsed;
    
    },

    /*
    * Stolen from james padolsey at
    * http://james.padolsey.com/javascript/removing-comments-in-javascript/
    * - This function is loosely based on the one found here:
    * - http://www.weanswer.it/blog/optimize-css-javascript-remove-comments-php/
    */
    _removeComments:  function(str) {
    str = ('__' + str + '__').split('');
    var mode = {
        singleQuote: false,
        doubleQuote: false,
        regex: false,
        blockComment: false,
        lineComment: false,
        condComp: false 
    };
    for (var i = 0, l = str.length; i < l; i++) {
 
        if (mode.regex) {
            if (str[i] === '/' && str[i-1] !== '\\') {
                mode.regex = false;
            }
            continue;
        }
 
        if (mode.singleQuote) {
            if (str[i] === "'" && str[i-1] !== '\\') {
                mode.singleQuote = false;
            }
            continue;
        }
 
        if (mode.doubleQuote) {
            if (str[i] === '"' && str[i-1] !== '\\') {
                mode.doubleQuote = false;
            }
            continue;
        }
 
        if (mode.blockComment) {
            if (str[i] === '*' && str[i+1] === '/') {
                str[i+1] = '';
                mode.blockComment = false;
            }
            str[i] = '';
            continue;
        }
 
        if (mode.lineComment) {
            if (str[i+1] === '\n' || str[i+1] === '\r') {
                mode.lineComment = false;
            }
            str[i] = '';
            continue;
        }
 
        if (mode.condComp) {
            if (str[i-2] === '@' && str[i-1] === '*' && str[i] === '/') {
                mode.condComp = false;
            }
            continue;
        }
 
        mode.doubleQuote = str[i] === '"';
        mode.singleQuote = str[i] === "'";
 
        if (str[i] === '/') {
 
            if (str[i+1] === '*' && str[i+2] === '@') {
                mode.condComp = true;
                continue;
            }
            if (str[i+1] === '*') {
                str[i] = '';
                mode.blockComment = true;
                continue;
            }
            if (str[i+1] === '/') {
                str[i] = '';
                mode.lineComment = true;
                continue;
            }
            mode.regex = true;
 
        }
 
      }
      return str.join('').slice(2, -2);
    },
    
    
    // IndexOf Function Stolen from UnderscoreJS, but pretty common, soo....
    _indexOf: function(array, item) {
      var ArrayProto = Array.prototype;
      if (ArrayProto.indexOf && array.indexOf === ArrayProto.indexOf) return array.indexOf(item);
      for (var i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
      return -1;
    }
  };
  
  // Leak Me
  global.Modulizr = Modulizr;
})(this);
