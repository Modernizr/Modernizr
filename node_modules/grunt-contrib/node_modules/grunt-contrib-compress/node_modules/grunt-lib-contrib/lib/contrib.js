/*
 * grunt-lib-contrib
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tyler Kellen, contributors
 * Licensed under the MIT license.
 */

exports.init = function(grunt) {
  'use strict';

  var exports = {};

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var path = require('path');

  // TODO: remove if/when we officially drop node <= 0.7.9
  path.sep = path.sep || path.normalize('/');

  exports.buildIndividualDest = function(dest, srcFile, basePath, flatten) {
    dest = path.normalize(dest);
    srcFile = path.normalize(srcFile);

    var newDest = path.dirname(dest);
    var newName = path.basename(srcFile, path.extname(srcFile)) + path.extname(dest);
    var relative = path.dirname(srcFile);

    if (flatten) {
      relative = '';
    } else if (basePath && basePath.length >= 1) {
      relative = grunt.util._(relative).strRight(basePath).trim(path.sep);
    }

    // make paths outside grunts working dir relative
    relative = relative.replace(/\.\.(\/|\\)/g, '');

    return path.join(newDest, relative, newName);
  };

  exports.findBasePath = function(srcFiles, basePath) {
    if (grunt.util.kindOf(basePath) === 'string' && basePath.length >= 1) {
      return grunt.util._(path.normalize(basePath)).trim(path.sep);
    }

    var foundPath;
    var basePaths = [];
    var dirName;

    srcFiles.forEach(function(srcFile) {
      srcFile = path.normalize(srcFile);
      dirName = path.dirname(srcFile);

      basePaths.push(dirName.split(path.sep));
    });

    basePaths = grunt.util._.intersection.apply([], basePaths);

    foundPath = path.join.apply(path, basePaths);

    if (foundPath === '.') {
      foundPath = '';
    }

    return foundPath;
  };

  exports.getNamespaceDeclaration = function(ns) {
    var output = [];
    var curPath = 'this';
    if (ns !== 'this') {
      var nsParts = ns.split('.');
      nsParts.forEach(function(curPart, index) {
        if (curPart !== 'this') {
          curPath += '[' + JSON.stringify(curPart) + ']';
          output.push(curPath + ' = ' + curPath + ' || {};');
        }
      });
    }

    return {
      namespace: curPath,
      declaration: output.join('\n')
    };
  };

  exports.isIndividualDest = function(dest) {
    if (grunt.util._.startsWith(path.basename(dest), '*')) {
      return true;
    } else {
      return false;
    }
  };

  // TODO: ditch this when grunt v0.4 is released
  // Temporary helper for normalizing files object
  exports.normalizeMultiTaskFiles = function(data, target) {
    var prop, obj;
    var files = [];
    if (grunt.util.kindOf(data) === 'object') {
      if ('src' in data || 'dest' in data) {
        obj = {};
        if ('src' in data) { obj.src = data.src; }
        if ('dest' in data) { obj.dest = data.dest; }
        files.push(obj);
      } else if (grunt.util.kindOf(data.files) === 'object') {
        for (prop in data.files) {
          files.push({src: data.files[prop], dest: prop});
        }
      } else if (Array.isArray(data.files)) {
        data.files.forEach(function(obj) {
          var prop;
          if ('src' in obj || 'dest' in obj) {
            files.push(obj);
          } else {
            for (prop in obj) {
              files.push({src: obj[prop], dest: prop});
            }
          }
        });
      }
    } else {
      files.push({src: data, dest: target});
    }

    // Process each normalized file object as a template.
    files.forEach(function(obj) {
      // Process src as a template (recursively, if necessary).
      if ('src' in obj) {
        obj.src = grunt.util.recurse(obj.src, function(src) {
          if (typeof src !== 'string') { return src; }
          return grunt.template.process(src);
        });
      }
      if ('dest' in obj) {
        // Process dest as a template.
        obj.dest = grunt.template.process(obj.dest);
      }
    });

    return files;
  };

  // Helper for consistent options key access across contrib tasks.
  exports.options = function(data, defaults) {
    var global_target = data.target ? grunt.config(['options', data.name, data.target]) : null;
    var global_task = grunt.config(['options', data.name]);

    if (global_task || global_target) {
      grunt.fail.warn('root level [options] key will be unsupported in grunt v0.4. please consider using task and target options.');
    }

    var target = data.target ? grunt.config([data.name, data.target, 'options']) : null;
    var task = grunt.config([data.name, 'options']);

    var options = grunt.util._.defaults({}, target, task, global_target, global_task, defaults);

    return grunt.util.recurse(options, function(value) {
      if (typeof value !== 'string') { return value; }

      return grunt.template.process(value);
    });
  };

  // Convert an object to an array of CLI arguments
  exports.optsToArgs = function(options) {
    var args = [];

    Object.keys(options).forEach(function(flag) {
      var val = options[flag];

      flag = flag.replace(/[A-Z]/g, function(match) {
        return '-' + match.toLowerCase();
      });

      if (val === true) {
        args.push('--' + flag);
      }

      if (grunt.util._.isString(val)) {
        args.push('--' + flag, val);
      }

      if (grunt.util._.isNumber(val)) {
        args.push('--' + flag, '' + val);
      }

      if (grunt.util._.isArray(val)) {
        val.forEach(function(arrVal) {
          args.push('--' + flag, arrVal);
        });
      }
    });

    return args;
  };

  return exports;
};
