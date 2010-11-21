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
     * Use `//>>module [some, modules, go here]` and `//>>module end` in order to section off
     * module defintions that could or couldn't be included in your source. The list of modules
     * is an implicit OR. It does not support nested modules.
     *
     * @argument source  {string} The marked up original source
     * @argument modules {array}  An array of strings that match identifiers in the source
     *
     * @returns {string} The new source with only the requested modules
     */
    ize: function(source, modules){
      // Split up source into chunks of module definitions and code.
      var result = [],
          chunks = source.split('//>>module '), //TODO::Make this safer for string literals and stuff
          chunk, i, j, k, len, req;
      
      // Loop the the strings between our token
      for(i in chunks) {
        chunk = $.trim(chunks[i]);
        
        // These chunks are the tops of module blocks
        if (chunk.charAt(0) === '[') {
          j = 1;
          len = chunk.length;
          // Find the next bracket
          while (j < len && chunk.charAt(j) !== ']') { ++j; }
          
          // If j is less than the length of the chunk, we found a bracket
          if (j < len) {
            // Pull out the required modules
            req = chunk.substr(1, j-1).split(',');
            
            // Loop through each module, and see if we want it
            for(k in req) {
              // Check with trimmed down module names
              if(this._indexOf(modules, $.trim(req[k])) >= 0) {
                // We should add the chunk if we're in here
                // Fake the ending, so it could be re-run
                result.push("//>>module " + chunk + "\n//>>module end");
              }
            }
          }
          // Otherwise, you suck at programming
          else {
            throw 'Modulr Syntax Error: Closing `]` not found near "' + chunk.substr(0,20) + '..."';
          }
          
        }
        
        // These chunks are the end statements, so we'll leave them out
        else if (chunk.substr(0,3) === 'end') {
          // remove the end line and append the rest
          // TODO::Check for characters on the commented line that appear after 'end' - JIC
          var remainingCode = $.trim(chunk.substr(3));
          if (remainingCode) {
            result.push(remainingCode);
          }
        }
        
        // This is a regular block (I think just the first block, actually), so we'll add it in
        else {
          result.push(chunk);
        }
      }
      
      return result.join("\n");
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