import fs from 'fs';
import polyfills from './polyfills.json';

const MarkdownIt = require('markdown-it');
const globby = require('glob')
const findDuplicateKeys = require('find-duplicated-property-keys')

const viewRoot = fs.realpathSync(__dirname + '/../feature-detects');

function metadata(cb) {
  var md = new MarkdownIt({html: true});
  var files = globby.sync(`${viewRoot}/**/*.js`)

  var tests = files.map(function(file) {
    var test = fs.readFileSync(file, 'utf8');
    var metaRE = /\/\*\!([\s\S]*)\!\*\//m;
    var metaMatches = test.match(metaRE);
    var docRE = /\/\*\sDOC([\s\S]*?)\*\//m;
    var docMatches = test.match(docRE);

    var metadata;

    if (metaMatches && metaMatches[1]) {

      var duplicateKeys = findDuplicateKeys(metaMatches[1])
      if (duplicateKeys.length > 0) {
        throw Error('duplicate key in ' + file + ' - ' + duplicateKeys.map(function(k) {return k.key}))
      }

      try {
        metadata = JSON.parse(metaMatches[1]);
      } catch (e) {
        throw new Error('Error Parsing Metadata: ' + file + '\nInput: `' + metaMatches[1] + '`');
      }
    }
    else {
      metadata = {};
    }

    var docs = null;

    if (docMatches && docMatches[1]) {
      docs = md.render(docMatches[1].trim());
    }

    metadata.doc = docs;

    metadata.amdPath = file
      .replace(/^.*feature-detects/, 'test')
      .replace(/\\/g, '/')
      .replace(/\.js$/i, '')

    if (!metadata.name) {
      metadata.name = metadata.amdPath;
    }

    var pfs = [];
    if (metadata.polyfills && metadata.polyfills.length) {
      metadata.polyfills.forEach(function(polyname) {
        if (polyfills[polyname]) {
          pfs.push(polyfills[polyname]);
        }
        else {
          throw new Error(metadata.name + ': Polyfill not found in `' + file + '`: ' + polyname);
        }
      });
    }
    metadata.polyfills = pfs;
    metadata.async = !!metadata.async

    if (!metadata.notes) {
      metadata.notes = [];
    }

    if (!metadata.warnings) {
      metadata.warnings = [];
    }

    if (!metadata.caniuse) {
      metadata.caniuse = null;
    }

    if (!metadata.cssclass && metadata.property) {
      metadata.cssclass = metadata.property;
    } else {
      metadata.cssclass = null;
    }

    // If you want markdown parsed code minus the docs and metadata, this'll do it.
    // Off by default for now.
    // metadata.code =  md.render('```javascript\n' + test.replace(metaRE, '').replace(docRE, '') + '\n```');

    if (!metadata.tags) {
      metadata.tags = [];
    }

    if (!metadata.authors) {
      metadata.authors = [];
    }

    if (!metadata.knownBugs) {
      metadata.knownBugs = [];
    }

    return metadata;
  });

  if (cb && typeof cb === 'function') {
    return cb(tests);
  }
  return tests;
}

export default metadata
