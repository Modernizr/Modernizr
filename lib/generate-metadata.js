'use strict';

// Generates metadata for the Modernizr project.
// Arguments:
//   callback (Function): Function to run when JSON generation is complete. An
//     `output` argument containing the JSON as a string is available.

module.exports = function metadata(callback) {
  var fs = require('fs');
  var file = require('file');
  var path = require('path');
  var marked = require('marked');
  var polyfills = require('./polyfills.json');
  var detectsPath = path.join(__dirname, '../feature-detects');
  var output = [];

  file.walkSync(detectsPath, function (dirPath, dirs, files) {

    files.forEach(function (file) {
      // Guard against cruft
      if (path.extname(file) !== '.js') {
        return;
      }

      var detect = fs.readFileSync(path.join(dirPath, file), 'utf8');

      // Extract metadata
      // TODO :: make this regex not suck
      var metaRE = /\/\*\!([\s\S]*)\!\*\//m;
      var metaMatches = detect.match(metaRE);
      var metadata = {};

      if (metaMatches && metaMatches[1]) {
        try {
          metadata = JSON.parse(metaMatches[1]);
        }
        catch(e) {
          throw new Error('Error Parsing Metadata for ' + file + '\nInput: `' + metaMatches[1] + '`');
        }
      }

      // Extract Docs
      var docRE = /\/\*\sDOC([\s\S]*)\*\//m;
      var docMatches = detect.match(docRE);
      var docs = null;

      if (docMatches && docMatches[1]) {
        docs = marked(docMatches[1].trim());
      }

      metadata.doc = docs;

      // Extract Dependencies
      var depRE = /define\((\[[^\]]*\]),/;
      var depMatches = detect.match(depRE);
      var deps = null;

      if (depMatches && depMatches[1]) {
        try {
          deps = JSON.parse(depMatches[1].replace(/'/g, '"'));
        }
        catch (e) {
          throw new Error('Error parsing dependencies for `' + file + '`:\nInput`' + depMatches[1] + '\n`');
        }

        var index = deps.indexOf('Modernizr');
        if (index !== -1) {
          deps.splice(index, 1);
        }
      }
      else {
        throw new Error('Couldn\'t find the define function for `' + file + '`');
      }

      metadata.deps = deps;

      // Add polyfill data
      var pfs = [];

      if (metadata.polyfills && metadata.polyfills.length) {
        metadata.polyfills.forEach(function (polyname) {
          if (polyfills[polyname]) {
            pfs.push(polyfills[polyname]);
          }
          else {
            throw new Error(metadata.name + ' polyfill `' + polyname  + '` not found in `' + file + '`');
          }
        });
      }

      metadata.polyfills = pfs;

      // Add path info
      metadata.path = './' + path.join(dirPath.match(/feature-detects.*/)[0], file);
      metadata.amdPath = metadata.path.replace(/^\.\/feature\-detects/, 'test').replace(/\.js$/i, '');

      if (!metadata.name) {
        metadata.name = metadata.amdPath;
      }

      if (!metadata.async) {
        metadata.async = false;
      }

      if (!metadata.notes) {
        metadata.notes = [];
      }

      if (!metadata.warnings) {
        metadata.warnings = [];
      }

      if (!metadata.caniuse) {
        metadata.caniuse = null;
      }

      // if (!metadata.helptext) {
      //   metadata.helptext = null;
      // }

      if (!metadata.cssclass && metadata.property) {
        metadata.cssclass = metadata.property;
      }
      else {
        metadata.cssclass = null;
      }

      // Maybe catch a bug
      if (!metadata.doc && metadata.docs) {
        metadata.doc = metadata.docs;
        delete metadata.docs;
      }

      // If you want markdown parsed code minus the docs and metadata, this'll do it.
      // Off by default for now.
      // metadata.code =  marked('```javascript\n' + detect.replace(metaRE, '').replace(docRE, '') + '\n```');

      if (!metadata.tags) {
        metadata.tags = [];
      }

      if (!metadata.authors) {
        metadata.authors = [];
      }

      if (!metadata.knownBugs) {
        metadata.knownBugs = [];
      }

      output.push(metadata);
    });
  });

  output = JSON.stringify(output);

  // Invoke callback
  if (typeof callback === 'function') {
    callback(output);
  }
  else {
    throw new Error('modernizr.metadata() must have a callback.');
  }
};
