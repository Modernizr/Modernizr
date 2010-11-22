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
     * @argument tests   {array}  An array of strings that match test string identifiers in the source
     *
     * @returns {string} The new source with only the requested modules
     */
    ize: function(source, tests){
      // Variables for string manipulation and saving
      var js_notests,
          js_nostr,
          parsed,
          i, j,
          strings = [],
          testStack = [],
          sid = '_' + ( + new Date()),
          multilinespaceExp = new RegExp(/\s{4}\n/g);
      
      source = this._removeComments(source);

      // Mark the tests
      js_notests = source.replace(/tests\['(.*)'\]/g, function($0, $1) {
        testStack[testStack.length] = {"code":$0, "name": $1};
        return 'TEST__'+$1+'__'
      });

      // remove string literals
      js_nostr = js_notestsstr.replace(/("|')((?:\\\1|.)+?)\1/g, function($0) {
      	strings[strings.length] = $0;
      	return 'STR__'+(strings.length-1)+'__';
      });


      js_nostr = this._pullOutTests(js_nostr, ['flexbox', 'touch', 'geolocation']);
      
      parsed = js_nostr;
      
      for (j = 0; j < strings.length; j++) {
        // put the strings back where they belong!
        parsed = parsed.replace(RegExp("STR__"+j+"__", 'g'), function() {
          return strings[j];
        });
      }

      // put the test array declarations back where they go
      for (i = 0; i < testStack.length; i++) {
        parsed = parsed.replace(RegExp("TEST__"+testStack[i].name+"__", 'g'), function($0) {
          return testStack[i].code;
        });
      }

      // Strip out the 4space-newline stuff that's left over, just for fun.
      while (multilinespaceExp.test(parsed)) {
        parsed = parsed.replace(multilinespaceExp, "");
      }

      // return the altered version
      return parsed;
    
    },

    _pullOutTests: function(source, wanted) {
      var sub, i, j, start, end, name, 
      sub2, bracketStack, tests = {}, 
      tmpStart, tmpEnd,
      spaceOffset = 0;

      // Step through the source
      for (i = 0; i < source.length; i++) {
        sub = source.substr(i, 6);
        // If we find a test identifier
        if (sub === "TEST__") {
          // Save the beginning here
          start = i;

          // counts along the name
          j = 0;

          // Grab it's name
          while (source.substr(i+j+6,2) !== '__') {
            j++;
          }
          // Save the name
          name = source.substr(i+6, j);
          
          // update counter
          i = i + j;

          // Look for a function definition next
          while (source.substr(i, 8) !== 'function') {
            i++;
          }

          // Skip past the function def
          i += 8;
          
          // Look for the opening '{' character
          while (source.substr(i, 1) !== '{') {
            i++;
          }

          // Set the initial count
          bracketStack = 1;
          i++;

          // Find an even amount of {} pairs
          while(bracketStack) {
            sub2 = source.substr(i,1);
            if (sub2 === '{') {
              bracketStack++;
            }
            else if (sub2 === '}') {
              bracketStack--;
            }
            i++;
          }
          // Add the semicolon
          end = i+1;
          
          // Add this to the tests hash
          tests[name] = {
            "start": start,
            "end": end
          };
        }
      }
      
      // Turn our wanted array into a hash, for speeedz
      var wantedHash = (function(){
        var hash = {}, k;
        for(k = 0; k < wanted.length; k++) {
          hash[wanted[k]] = true;
        }
        return hash;
      })();

      // go through the tests that we know about, and remove the ones we don't want
      for (var test in tests) {
        if (tests.hasOwnProperty(test)) {
          // If it's not one that we want
          if (!wantedHash[test]) {
            tmpStart = tests[test].start;
            tmpEnd   = tests[test].end;
            // Take it out
            source = source.substr(0, tmpStart - spaceOffset) + source.substr(tmpEnd - spaceOffset);
            spaceOffset += tmpEnd - tmpStart;
          }
        }
      }
      return source;
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
