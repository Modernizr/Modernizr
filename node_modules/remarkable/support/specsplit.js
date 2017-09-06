#!/usr/bin/env node
/*eslint no-console:0*/

// Fixtures generator from commonmark specs. Split spec to working / not working
// examples, or show total stat.

'use strict';


var fs        = require('fs');
var util      = require('util');
var argparse  = require('argparse');

var Remarkable = require('..');


var cli = new argparse.ArgumentParser({
  prog: 'specsplit',
  version: require('../package.json').version,
  addHelp: true
});

cli.addArgument([ 'type' ], {
  help: 'type of examples to filter',
  nargs: '?',
  choices: [ 'good', 'bad' ]
});

cli.addArgument([ 'spec' ], {
  help: 'spec file to read'
});

var options = cli.parseArgs();

////////////////////////////////////////////////////////////////////////////////

function readFile(filename, encoding, callback) {
  if (options.file === '-') {
    // read from stdin

    var chunks = [];

    process.stdin.on('data', function(chunk) {
      chunks.push(chunk);
    });

    process.stdin.on('end', function() {
      return callback(null, Buffer.concat(chunks).toString(encoding));
    });
  } else {
    fs.readFile(filename, encoding, callback);
  }
}


////////////////////////////////////////////////////////////////////////////////

readFile(options.spec, 'utf8', function (error, input) {
  var good = [], bad = [],
      markdown = new Remarkable('commonmark');

  if (error) {
    if (error.code === 'ENOENT') {
      process.stderr.write('File not found: ' + options.spec);
      process.exit(2);
    }

    process.stderr.write(error.stack || error.message || String(error));
    process.exit(1);
  }

  input = input.replace(/→/g, '\t');

  input.replace(/^\.\n([\s\S]*?)^\.\n([\s\S]*?)^\.$/gm, function(__, md, html, offset, orig) {

    var result = {
      md: md,
      html: html,
      line: orig.slice(0, offset).split(/\r?\n/g).length,
      err: ''
    };

    try {
      if (markdown.render(md) === html) {
        good.push(result);
      } else {
        result.err = markdown.render(md);
        bad.push(result);
      }
    } catch (___) {
      bad.push(result);
    }
  });

  if (!options.type) {
    console.log(util.format('passed samples - %s, failed samples - %s', good.length, bad.length));
  } else {
    var data = options.type === 'good' ? good : bad;

    data.forEach(function (sample) {
      console.log(util.format(
        '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n' +
        'src line: %s\n\n.\n%s.\n%s.\n',
        sample.line, sample.md, sample.html));
      if (sample.err) {
        console.log(util.format('error:\n\n%s\n', sample.err));
      }
    });
  }

  process.exit(0);
});
