'use strict';

/**
 * Various utility functions used throughout Mocha's codebase.
 * @module utils
 */

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var util = require('util');
var glob = require('glob');
var he = require('he');
var errors = require('./errors');
var createNoFilesMatchPatternError = errors.createNoFilesMatchPatternError;
var createMissingArgumentError = errors.createMissingArgumentError;

var assign = (exports.assign = require('object.assign').getPolyfill());

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * @param {function} ctor - Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor - Constructor function to inherit prototype from.
 * @throws {TypeError} if either constructor is null, or if super constructor
 *     lacks a prototype.
 */
exports.inherits = util.inherits;

/**
 * Escape special characters in the given string of html.
 *
 * @private
 * @param  {string} html
 * @return {string}
 */
exports.escape = function(html) {
  return he.encode(String(html), {useNamedReferences: false});
};

/**
 * Test if the given obj is type of string.
 *
 * @private
 * @param {Object} obj
 * @return {boolean}
 */
exports.isString = function(obj) {
  return typeof obj === 'string';
};

/**
 * Compute a slug from the given `str`.
 *
 * @private
 * @param {string} str
 * @return {string}
 */
exports.slug = function(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^-\w]/g, '')
    .replace(/-{2,}/g, '-');
};

/**
 * Strip the function definition from `str`, and re-indent for pre whitespace.
 *
 * @param {string} str
 * @return {string}
 */
exports.clean = function(str) {
  str = str
    .replace(/\r\n?|[\n\u2028\u2029]/g, '\n')
    .replace(/^\uFEFF/, '')
    // (traditional)->  space/name     parameters    body     (lambda)-> parameters       body   multi-statement/single          keep body content
    .replace(
      /^function(?:\s*|\s+[^(]*)\([^)]*\)\s*\{((?:.|\n)*?)\s*\}$|^\([^)]*\)\s*=>\s*(?:\{((?:.|\n)*?)\s*\}|((?:.|\n)*))$/,
      '$1$2$3'
    );

  var spaces = str.match(/^\n?( *)/)[1].length;
  var tabs = str.match(/^\n?(\t*)/)[1].length;
  var re = new RegExp(
    '^\n?' + (tabs ? '\t' : ' ') + '{' + (tabs || spaces) + '}',
    'gm'
  );

  str = str.replace(re, '');

  return str.trim();
};

/**
 * Parse the given `qs`.
 *
 * @private
 * @param {string} qs
 * @return {Object}
 */
exports.parseQuery = function(qs) {
  return qs
    .replace('?', '')
    .split('&')
    .reduce(function(obj, pair) {
      var i = pair.indexOf('=');
      var key = pair.slice(0, i);
      var val = pair.slice(++i);

      // Due to how the URLSearchParams API treats spaces
      obj[key] = decodeURIComponent(val.replace(/\+/g, '%20'));

      return obj;
    }, {});
};

/**
 * Highlight the given string of `js`.
 *
 * @private
 * @param {string} js
 * @return {string}
 */
function highlight(js) {
  return js
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\/\/(.*)/gm, '<span class="comment">//$1</span>')
    .replace(/('.*?')/gm, '<span class="string">$1</span>')
    .replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
    .replace(/(\d+)/gm, '<span class="number">$1</span>')
    .replace(
      /\bnew[ \t]+(\w+)/gm,
      '<span class="keyword">new</span> <span class="init">$1</span>'
    )
    .replace(
      /\b(function|new|throw|return|var|if|else)\b/gm,
      '<span class="keyword">$1</span>'
    );
}

/**
 * Highlight the contents of tag `name`.
 *
 * @private
 * @param {string} name
 */
exports.highlightTags = function(name) {
  var code = document.getElementById('mocha').getElementsByTagName(name);
  for (var i = 0, len = code.length; i < len; ++i) {
    code[i].innerHTML = highlight(code[i].innerHTML);
  }
};

/**
 * If a value could have properties, and has none, this function is called,
 * which returns a string representation of the empty value.
 *
 * Functions w/ no properties return `'[Function]'`
 * Arrays w/ length === 0 return `'[]'`
 * Objects w/ no properties return `'{}'`
 * All else: return result of `value.toString()`
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} typeHint The type of the value
 * @returns {string}
 */
function emptyRepresentation(value, typeHint) {
  switch (typeHint) {
    case 'function':
      return '[Function]';
    case 'object':
      return '{}';
    case 'array':
      return '[]';
    default:
      return value.toString();
  }
}

/**
 * Takes some variable and asks `Object.prototype.toString()` what it thinks it
 * is.
 *
 * @private
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
 * @param {*} value The value to test.
 * @returns {string} Computed type
 * @example
 * type({}) // 'object'
 * type([]) // 'array'
 * type(1) // 'number'
 * type(false) // 'boolean'
 * type(Infinity) // 'number'
 * type(null) // 'null'
 * type(new Date()) // 'date'
 * type(/foo/) // 'regexp'
 * type('type') // 'string'
 * type(global) // 'global'
 * type(new String('foo') // 'object'
 */
var type = (exports.type = function type(value) {
  if (value === undefined) {
    return 'undefined';
  } else if (value === null) {
    return 'null';
  } else if (Buffer.isBuffer(value)) {
    return 'buffer';
  }
  return Object.prototype.toString
    .call(value)
    .replace(/^\[.+\s(.+?)]$/, '$1')
    .toLowerCase();
});

/**
 * Stringify `value`. Different behavior depending on type of value:
 *
 * - If `value` is undefined or null, return `'[undefined]'` or `'[null]'`, respectively.
 * - If `value` is not an object, function or array, return result of `value.toString()` wrapped in double-quotes.
 * - If `value` is an *empty* object, function, or array, return result of function
 *   {@link emptyRepresentation}.
 * - If `value` has properties, call {@link exports.canonicalize} on it, then return result of
 *   JSON.stringify().
 *
 * @private
 * @see exports.type
 * @param {*} value
 * @return {string}
 */
exports.stringify = function(value) {
  var typeHint = type(value);

  if (!~['object', 'array', 'function'].indexOf(typeHint)) {
    if (typeHint === 'buffer') {
      var json = Buffer.prototype.toJSON.call(value);
      // Based on the toJSON result
      return jsonStringify(
        json.data && json.type ? json.data : json,
        2
      ).replace(/,(\n|$)/g, '$1');
    }

    // IE7/IE8 has a bizarre String constructor; needs to be coerced
    // into an array and back to obj.
    if (typeHint === 'string' && typeof value === 'object') {
      value = value.split('').reduce(function(acc, char, idx) {
        acc[idx] = char;
        return acc;
      }, {});
      typeHint = 'object';
    } else {
      return jsonStringify(value);
    }
  }

  for (var prop in value) {
    if (Object.prototype.hasOwnProperty.call(value, prop)) {
      return jsonStringify(
        exports.canonicalize(value, null, typeHint),
        2
      ).replace(/,(\n|$)/g, '$1');
    }
  }

  return emptyRepresentation(value, typeHint);
};

/**
 * like JSON.stringify but more sense.
 *
 * @private
 * @param {Object}  object
 * @param {number=} spaces
 * @param {number=} depth
 * @returns {*}
 */
function jsonStringify(object, spaces, depth) {
  if (typeof spaces === 'undefined') {
    // primitive types
    return _stringify(object);
  }

  depth = depth || 1;
  var space = spaces * depth;
  var str = Array.isArray(object) ? '[' : '{';
  var end = Array.isArray(object) ? ']' : '}';
  var length =
    typeof object.length === 'number'
      ? object.length
      : Object.keys(object).length;
  // `.repeat()` polyfill
  function repeat(s, n) {
    return new Array(n).join(s);
  }

  function _stringify(val) {
    switch (type(val)) {
      case 'null':
      case 'undefined':
        val = '[' + val + ']';
        break;
      case 'array':
      case 'object':
        val = jsonStringify(val, spaces, depth + 1);
        break;
      case 'boolean':
      case 'regexp':
      case 'symbol':
      case 'number':
        val =
          val === 0 && 1 / val === -Infinity // `-0`
            ? '-0'
            : val.toString();
        break;
      case 'date':
        var sDate = isNaN(val.getTime()) ? val.toString() : val.toISOString();
        val = '[Date: ' + sDate + ']';
        break;
      case 'buffer':
        var json = val.toJSON();
        // Based on the toJSON result
        json = json.data && json.type ? json.data : json;
        val = '[Buffer: ' + jsonStringify(json, 2, depth + 1) + ']';
        break;
      default:
        val =
          val === '[Function]' || val === '[Circular]'
            ? val
            : JSON.stringify(val); // string
    }
    return val;
  }

  for (var i in object) {
    if (!Object.prototype.hasOwnProperty.call(object, i)) {
      continue; // not my business
    }
    --length;
    str +=
      '\n ' +
      repeat(' ', space) +
      (Array.isArray(object) ? '' : '"' + i + '": ') + // key
      _stringify(object[i]) + // value
      (length ? ',' : ''); // comma
  }

  return (
    str +
    // [], {}
    (str.length !== 1 ? '\n' + repeat(' ', --space) + end : end)
  );
}

/**
 * Return a new Thing that has the keys in sorted order. Recursive.
 *
 * If the Thing...
 * - has already been seen, return string `'[Circular]'`
 * - is `undefined`, return string `'[undefined]'`
 * - is `null`, return value `null`
 * - is some other primitive, return the value
 * - is not a primitive or an `Array`, `Object`, or `Function`, return the value of the Thing's `toString()` method
 * - is a non-empty `Array`, `Object`, or `Function`, return the result of calling this function again.
 * - is an empty `Array`, `Object`, or `Function`, return the result of calling `emptyRepresentation()`
 *
 * @private
 * @see {@link exports.stringify}
 * @param {*} value Thing to inspect.  May or may not have properties.
 * @param {Array} [stack=[]] Stack of seen values
 * @param {string} [typeHint] Type hint
 * @return {(Object|Array|Function|string|undefined)}
 */
exports.canonicalize = function canonicalize(value, stack, typeHint) {
  var canonicalizedObj;
  /* eslint-disable no-unused-vars */
  var prop;
  /* eslint-enable no-unused-vars */
  typeHint = typeHint || type(value);
  function withStack(value, fn) {
    stack.push(value);
    fn();
    stack.pop();
  }

  stack = stack || [];

  if (stack.indexOf(value) !== -1) {
    return '[Circular]';
  }

  switch (typeHint) {
    case 'undefined':
    case 'buffer':
    case 'null':
      canonicalizedObj = value;
      break;
    case 'array':
      withStack(value, function() {
        canonicalizedObj = value.map(function(item) {
          return exports.canonicalize(item, stack);
        });
      });
      break;
    case 'function':
      /* eslint-disable guard-for-in */
      for (prop in value) {
        canonicalizedObj = {};
        break;
      }
      /* eslint-enable guard-for-in */
      if (!canonicalizedObj) {
        canonicalizedObj = emptyRepresentation(value, typeHint);
        break;
      }
    /* falls through */
    case 'object':
      canonicalizedObj = canonicalizedObj || {};
      withStack(value, function() {
        Object.keys(value)
          .sort()
          .forEach(function(key) {
            canonicalizedObj[key] = exports.canonicalize(value[key], stack);
          });
      });
      break;
    case 'date':
    case 'number':
    case 'regexp':
    case 'boolean':
    case 'symbol':
      canonicalizedObj = value;
      break;
    default:
      canonicalizedObj = value + '';
  }

  return canonicalizedObj;
};

/**
 * Determines if pathname has a matching file extension.
 *
 * @private
 * @param {string} pathname - Pathname to check for match.
 * @param {string[]} exts - List of file extensions (sans period).
 * @return {boolean} whether file extension matches.
 * @example
 * hasMatchingExtname('foo.html', ['js', 'css']); // => false
 */
function hasMatchingExtname(pathname, exts) {
  var suffix = path.extname(pathname).slice(1);
  return exts.some(function(element) {
    return suffix === element;
  });
}

/**
 * Determines if pathname would be a "hidden" file (or directory) on UN*X.
 *
 * @description
 * On UN*X, pathnames beginning with a full stop (aka dot) are hidden during
 * typical usage. Dotfiles, plain-text configuration files, are prime examples.
 *
 * @see {@link http://xahlee.info/UnixResource_dir/writ/unix_origin_of_dot_filename.html|Origin of Dot File Names}
 *
 * @private
 * @param {string} pathname - Pathname to check for match.
 * @return {boolean} whether pathname would be considered a hidden file.
 * @example
 * isHiddenOnUnix('.profile'); // => true
 */
function isHiddenOnUnix(pathname) {
  return path.basename(pathname)[0] === '.';
}

/**
 * Lookup file names at the given `path`.
 *
 * @description
 * Filenames are returned in _traversal_ order by the OS/filesystem.
 * **Make no assumption that the names will be sorted in any fashion.**
 *
 * @public
 * @memberof Mocha.utils
 * @param {string} filepath - Base path to start searching from.
 * @param {string[]} [extensions=[]] - File extensions to look for.
 * @param {boolean} [recursive=false] - Whether to recurse into subdirectories.
 * @return {string[]} An array of paths.
 * @throws {Error} if no files match pattern.
 * @throws {TypeError} if `filepath` is directory and `extensions` not provided.
 */
exports.lookupFiles = function lookupFiles(filepath, extensions, recursive) {
  extensions = extensions || [];
  recursive = recursive || false;
  var files = [];
  var stat;

  if (!fs.existsSync(filepath)) {
    var pattern;
    if (glob.hasMagic(filepath)) {
      // Handle glob as is without extensions
      pattern = filepath;
    } else {
      // glob pattern e.g. 'filepath+(.js|.ts)'
      var strExtensions = extensions
        .map(function(v) {
          return '.' + v;
        })
        .join('|');
      pattern = filepath + '+(' + strExtensions + ')';
    }
    files = glob.sync(pattern, {nodir: true});
    if (!files.length) {
      throw createNoFilesMatchPatternError(
        'Cannot find any files matching pattern ' + exports.dQuote(filepath),
        filepath
      );
    }
    return files;
  }

  // Handle file
  try {
    stat = fs.statSync(filepath);
    if (stat.isFile()) {
      return filepath;
    }
  } catch (err) {
    // ignore error
    return;
  }

  // Handle directory
  fs.readdirSync(filepath).forEach(function(dirent) {
    var pathname = path.join(filepath, dirent);
    var stat;

    try {
      stat = fs.statSync(pathname);
      if (stat.isDirectory()) {
        if (recursive) {
          files = files.concat(lookupFiles(pathname, extensions, recursive));
        }
        return;
      }
    } catch (err) {
      // ignore error
      return;
    }
    if (!extensions.length) {
      throw createMissingArgumentError(
        util.format(
          'Argument %s required when argument %s is a directory',
          exports.sQuote('extensions'),
          exports.sQuote('filepath')
        ),
        'extensions',
        'array'
      );
    }

    if (
      !stat.isFile() ||
      !hasMatchingExtname(pathname, extensions) ||
      isHiddenOnUnix(pathname)
    ) {
      return;
    }
    files.push(pathname);
  });

  return files;
};

/**
 * process.emitWarning or a polyfill
 * @see https://nodejs.org/api/process.html#process_process_emitwarning_warning_options
 * @ignore
 */
function emitWarning(msg, type) {
  if (process.emitWarning) {
    process.emitWarning(msg, type);
  } else {
    process.nextTick(function() {
      console.warn(type + ': ' + msg);
    });
  }
}

/**
 * Show a deprecation warning. Each distinct message is only displayed once.
 * Ignores empty messages.
 *
 * @param {string} [msg] - Warning to print
 * @private
 */
exports.deprecate = function deprecate(msg) {
  msg = String(msg);
  if (msg && !deprecate.cache[msg]) {
    deprecate.cache[msg] = true;
    emitWarning(msg, 'DeprecationWarning');
  }
};
exports.deprecate.cache = {};

/**
 * Show a generic warning.
 * Ignores empty messages.
 *
 * @param {string} [msg] - Warning to print
 * @private
 */
exports.warn = function warn(msg) {
  if (msg) {
    emitWarning(msg);
  }
};

/**
 * @summary
 * This Filter based on `mocha-clean` module.(see: `github.com/rstacruz/mocha-clean`)
 * @description
 * When invoking this function you get a filter function that get the Error.stack as an input,
 * and return a prettify output.
 * (i.e: strip Mocha and internal node functions from stack trace).
 * @returns {Function}
 */
exports.stackTraceFilter = function() {
  // TODO: Replace with `process.browser`
  var is = typeof document === 'undefined' ? {node: true} : {browser: true};
  var slash = path.sep;
  var cwd;
  if (is.node) {
    cwd = exports.cwd() + slash;
  } else {
    cwd = (typeof location === 'undefined'
      ? window.location
      : location
    ).href.replace(/\/[^/]*$/, '/');
    slash = '/';
  }

  function isMochaInternal(line) {
    return (
      ~line.indexOf('node_modules' + slash + 'mocha' + slash) ||
      ~line.indexOf(slash + 'mocha.js') ||
      ~line.indexOf(slash + 'mocha.min.js')
    );
  }

  function isNodeInternal(line) {
    return (
      ~line.indexOf('(timers.js:') ||
      ~line.indexOf('(events.js:') ||
      ~line.indexOf('(node.js:') ||
      ~line.indexOf('(module.js:') ||
      ~line.indexOf('GeneratorFunctionPrototype.next (native)') ||
      false
    );
  }

  return function(stack) {
    stack = stack.split('\n');

    stack = stack.reduce(function(list, line) {
      if (isMochaInternal(line)) {
        return list;
      }

      if (is.node && isNodeInternal(line)) {
        return list;
      }

      // Clean up cwd(absolute)
      if (/:\d+:\d+\)?$/.test(line)) {
        line = line.replace('(' + cwd, '(');
      }

      list.push(line);
      return list;
    }, []);

    return stack.join('\n');
  };
};

/**
 * Crude, but effective.
 * @public
 * @param {*} value
 * @returns {boolean} Whether or not `value` is a Promise
 */
exports.isPromise = function isPromise(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.then === 'function'
  );
};

/**
 * Clamps a numeric value to an inclusive range.
 *
 * @param {number} value - Value to be clamped.
 * @param {numer[]} range - Two element array specifying [min, max] range.
 * @returns {number} clamped value
 */
exports.clamp = function clamp(value, range) {
  return Math.min(Math.max(value, range[0]), range[1]);
};

/**
 * Single quote text by combining with undirectional ASCII quotation marks.
 *
 * @description
 * Provides a simple means of markup for quoting text to be used in output.
 * Use this to quote names of variables, methods, and packages.
 *
 * <samp>package 'foo' cannot be found</samp>
 *
 * @private
 * @param {string} str - Value to be quoted.
 * @returns {string} quoted value
 * @example
 * sQuote('n') // => 'n'
 */
exports.sQuote = function(str) {
  return "'" + str + "'";
};

/**
 * Double quote text by combining with undirectional ASCII quotation marks.
 *
 * @description
 * Provides a simple means of markup for quoting text to be used in output.
 * Use this to quote names of datatypes, classes, pathnames, and strings.
 *
 * <samp>argument 'value' must be "string" or "number"</samp>
 *
 * @private
 * @param {string} str - Value to be quoted.
 * @returns {string} quoted value
 * @example
 * dQuote('number') // => "number"
 */
exports.dQuote = function(str) {
  return '"' + str + '"';
};

/**
 * It's a noop.
 * @public
 */
exports.noop = function() {};

/**
 * Creates a map-like object.
 *
 * @description
 * A "map" is an object with no prototype, for our purposes. In some cases
 * this would be more appropriate than a `Map`, especially if your environment
 * doesn't support it. Recommended for use in Mocha's public APIs.
 *
 * @public
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map|MDN:Map}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Custom_and_Null_objects|MDN:Object.create - Custom objects}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign|MDN:Object.assign}
 * @param {...*} [obj] - Arguments to `Object.assign()`.
 * @returns {Object} An object with no prototype, having `...obj` properties
 */
exports.createMap = function(obj) {
  return assign.apply(
    null,
    [Object.create(null)].concat(Array.prototype.slice.call(arguments))
  );
};

/**
 * Creates a read-only map-like object.
 *
 * @description
 * This differs from {@link module:utils.createMap createMap} only in that
 * the argument must be non-empty, because the result is frozen.
 *
 * @see {@link module:utils.createMap createMap}
 * @param {...*} [obj] - Arguments to `Object.assign()`.
 * @returns {Object} A frozen object with no prototype, having `...obj` properties
 * @throws {TypeError} if argument is not a non-empty object.
 */
exports.defineConstants = function(obj) {
  if (type(obj) !== 'object' || !Object.keys(obj).length) {
    throw new TypeError('Invalid argument; expected a non-empty object');
  }
  return Object.freeze(exports.createMap(obj));
};

/**
 * Whether current version of Node support ES modules
 *
 * @description
 * Versions prior to 10 did not support ES Modules, and version 10 has an old incompatibile version of ESM.
 * This function returns whether Node.JS has ES Module supports that is compatible with Mocha's needs,
 * which is version >=12.11.
 *
 * @returns {Boolean} whether the current version of Node.JS supports ES Modules in a way that is compatible with Mocha
 */
exports.supportsEsModules = function() {
  if (!process.browser && process.versions && process.versions.node) {
    var versionFields = process.versions.node.split('.');
    var major = +versionFields[0];
    var minor = +versionFields[1];

    if (major >= 13 || (major === 12 && minor >= 11)) {
      return true;
    }
  }
};

/**
 * Returns current working directory
 *
 * Wrapper around `process.cwd()` for isolation
 * @private
 */
exports.cwd = function cwd() {
  return process.cwd();
};
