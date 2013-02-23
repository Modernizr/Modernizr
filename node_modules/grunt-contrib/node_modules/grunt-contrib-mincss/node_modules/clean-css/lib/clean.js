var util = require('util');

var CleanCSS = {
  colors: {
    white: '#fff',
    black: '#000',
    fuchsia: '#f0f',
    yellow: '#ff0'
  },

  process: function(data, options) {
    var context = {
      specialComments: [],
      contentBlocks: []
    };
    var replace = function(pattern, replacement) {
      if (typeof arguments[0] == 'function')
        arguments[0]();
      else
        data = data.replace.apply(data, arguments);
    };

    options = options || {};

    // * - leave all important comments
    // 1 - leave first important comment only
    // 0 - strip all important comments
    options.keepSpecialComments = 'keepSpecialComments' in options ?
      options.keepSpecialComments :
      '*';

    options.keepBreaks = options.keepBreaks || false;

    // replace function
    if (options.debug) {
      var originalReplace = replace;
      replace = function(pattern, replacement) {
        var name = typeof pattern == 'function' ?
          /function (\w+)\(/.exec(pattern.toString())[1] :
          pattern;
        console.time(name);
        originalReplace(pattern, replacement);
        console.timeEnd(name);
      };
    }

    // strip comments one by one
    replace(function stripComments() {
      data = CleanCSS._stripComments(context, data);
    });

    // replace content: with a placeholder
    replace(function stripContent() {
      data = CleanCSS._stripContent(context, data);
    });

    // strip url's parentheses if possible (no spaces inside)
    replace(/url\(['"]([^\)]+)['"]\)/g, function(urlMatch) {
      if (urlMatch.match(/\s/g) !== null)
        return urlMatch;
      else
        return urlMatch.replace(/\(['"]/, '(').replace(/['"]\)$/, ')');
    });

    // whitespace between semicolons & multiple semicolons
    replace(/;\s*;+/g, ';');

    // line breaks
    if (!options.keepBreaks)
      replace(/[\r]?\n/g, '');

    // multiple whitespace
    replace(/[\t ]+/g, ' ');

    // multiple line breaks to one
    replace(/ \n/g, '\n');
    replace(/ \r\n/g, '\r\n');
    replace(/\n+/g, '\n');
    replace(/(\r\n)+/g, '\r\n');

    // whitespace before !important
    replace(/ !important/g, '!important');

    // space with a comma
    replace(/[ ]?,[ ]?/g, ',');

    // restore spaces inside IE filters (IE 7 issue)
    replace(/progid:[^(]+\(([^\)]+)/g, function(match, contents) {
      return match.replace(/,/g, ', ');
    });

    // replace spaces around selectors
    replace(/ ([+~>]) /g, '$1');

    // whitespace inside content
    replace(/\{([^}]+)\}/g, function(match, contents) {
      return '{' + contents.trim().replace(/(\s*)([;:=\s])(\s*)/g, '$2') + '}';
    });

    // trailing semicolons
    replace(/;}/g, '}');

    // rgb to hex colors
    replace(/rgb\s*\(([^\)]+)\)/g, function(match, color) {
      var parts = color.split(',');
      var encoded = '#';
      for (var i = 0; i < 3; i++) {
        var asHex = parseInt(parts[i], 10).toString(16);
        encoded += asHex.length == 1 ? '0' + asHex : asHex;
      }
      return encoded;
    });

    // long hex to short hex
    replace(/([,: \(])#([0-9a-f]{6})/gi, function(match, prefix, color) {
      if (color[0] == color[1] && color[2] == color[3] && color[4] == color[5])
        return prefix + '#' + color[0] + color[2] + color[4];
      else
        return prefix + '#' + color;
    });

    // replace standard colors with hex values (only if color name is longer then hex value)
    replace(/(color|background):(\w+)/g, function(match, property, colorName) {
      if (CleanCSS.colors[colorName]) return property + ':' + CleanCSS.colors[colorName];
      else return match;
    });

    // replace #f00 with red as it's shorter
    replace(/([: ,\(])#f00/g, '$1red');

    // replace font weight with numerical value
    replace(/font\-weight:(\w+)/g, function(match, weight) {
      if (weight == 'normal') return 'font-weight:400';
      else if (weight == 'bold') return 'font-weight:700';
      else return match;
    });

    // IE shorter filters but only if single (IE 7 issue)
    replace(/progid:DXImageTransform\.Microsoft\.(Alpha|Chroma)(\([^\)]+\))([;}'"])/g, function(match, filter, args, suffix) {
      return filter.toLowerCase() + args + suffix;
    });

    // zero + unit to zero
    replace(/(\s|:|,)0(px|em|ex|cm|mm|in|pt|pc|%)/g, '$1' + '0');
    replace(/rect\(0(px|em|ex|cm|mm|in|pt|pc|%)/g, 'rect(0');

    // none to 0
    replace(/(border|border-top|border-right|border-bottom|border-left|outline):none/g, '$1:0');

    // background:none to 0
    replace(/(background):none([;}])/g, '$1:0$2');

    // multiple zeros into one
    replace(/:0 0 0 0([^\.])/g, ':0$1');
    replace(/([: ,=\-])0\.(\d)/g, '$1.$2');

    // restore rect(...) zeros syntax for 4 zeros
    replace(/rect\(\s?0(\s|,)0[ ,]0[ ,]0\s?\)/g, 'rect(0$10$10$10)');

    // empty elements
    if (options.removeEmpty)
      replace(/[^}]+?{\s*?}/g, '');

    // move first charset to the beginning
    if (data.indexOf('charset') > 0)
      replace(/(.+)(@charset [^;]+;)/, '$2$1');

    // remove all extra charsets that are not at the beginning
    replace(/(.)(@charset [^;]+;)/g, '$1');

    // remove universal selector when not needed (*#id, *.class etc)
    replace(/\*([\.#:\[])/g, '$1');

    // whitespace before definition
    replace(/ {/g, '{');

    // whitespace after definition
    replace(/\} /g, '}');

    // Get the special comments, content content, and spaces inside calc back
    var specialCommentsCount = context.specialComments.length;

    replace(/calc\([^\}]+\}/g, function(match) {
      return match.replace(/\+/g, ' + ');
    });
    replace(/__CSSCOMMENT__/g, function(i) {
      switch (options.keepSpecialComments) {
        case '*':
          return context.specialComments.shift();
        case 1:
          return context.specialComments.length == specialCommentsCount ?
            context.specialComments.shift() :
            '';
        case 0:
          return '';
      }
    });
    replace(/__CSSCONTENT__/g, function() {
      return context.contentBlocks.shift();
    });

    // trim spaces at beginning and end
    return data.trim();
  },

  // Strips special comments (/*! ... */) by replacing them by __CSSCOMMENT__ marker
  // for further restoring. Plain comments are removed. It's done by scanning datq using
  // String#indexOf scanning instead of regexps to speed up the process.
  _stripComments: function(context, data) {
    var tempData = [],
      nextStart = 0,
      nextEnd = 0,
      cursor = 0;

    for (; nextEnd < data.length; ) {
      nextStart = data.indexOf('/*', nextEnd);
      nextEnd = data.indexOf('*/', nextStart);
      if (nextStart == -1 || nextEnd == -1) break;

      tempData.push(data.substring(cursor, nextStart));
      if (data[nextStart + 2] == '!') {
        // in case of special comments, replace them with a placeholder
        context.specialComments.push(data.substring(nextStart, nextEnd + 2));
        tempData.push('__CSSCOMMENT__');
      }
      cursor = nextEnd + 2;
    }

    return tempData.length > 0 ?
      tempData.join('') + data.substring(cursor, data.length) :
      data;
  },

  // Strips content tags by replacing them by __CSSCONTENT__ marker
  // for further restoring. It's done via string scanning instead of
  // regexps to speed up the process.
  _stripContent: function(context, data) {
    var tempData = [],
      nextStart = 0,
      nextEnd = 0,
      tempStart = 0,
      cursor = 0,
      matchedParenthesis = null;

    // Finds either first (matchedParenthesis == null) or second matching parenthesis
    // so we can determine boundaries of content block.
    var nextParenthesis = function(pos) {
      var min,
        max = data.length;

      if (matchedParenthesis) {
        min = data.indexOf(matchedParenthesis, pos);
        if (min == -1) min = max;
      } else {
        var next1 = data.indexOf("'", pos);
        var next2 = data.indexOf('"', pos);
        if (next1 == -1) next1 = max;
        if (next2 == -1) next2 = max;

        min = next1 > next2 ? next2 : next1;
      }

      if (min == max) return -1;

      if (matchedParenthesis) {
        matchedParenthesis = null;
        return min;
      } else {
        // check if there's anything else between pos and min that doesn't match ':' or whitespace
        if (/[^:\s]/.test(data.substring(pos, min))) return -1;
        matchedParenthesis = data.charAt(min);
        return min + 1;
      }
    };

    for (; nextEnd < data.length; ) {
      nextStart = data.indexOf('content', nextEnd);
      if (nextStart == -1) break;

      nextStart = nextParenthesis(nextStart + 7);
      nextEnd = nextParenthesis(nextStart);
      if (nextStart == -1 || nextEnd == -1) break;

      tempData.push(data.substring(cursor, nextStart - 1));
      tempData.push('__CSSCONTENT__');
      context.contentBlocks.push(data.substring(nextStart - 1, nextEnd + 1));
      cursor = nextEnd + 1;
    }

    return tempData.length > 0 ?
      tempData.join('') + data.substring(cursor, data.length) :
      data;
  }
};

module.exports = CleanCSS;
