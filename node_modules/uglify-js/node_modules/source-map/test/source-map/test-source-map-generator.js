/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function (require, exports, module) {

  var SourceMapGenerator = require('../../lib/source-map/source-map-generator').SourceMapGenerator;

  exports['test some simple stuff'] = function (assert, util) {
    var map = new SourceMapGenerator({
      file: 'foo.js',
      sourceRoot: '.'
    });
    assert.ok(true);
  };

  exports['test JSON serialization'] = function (assert, util) {
    var map = new SourceMapGenerator({
      file: 'foo.js',
      sourceRoot: '.'
    });
    assert.equal(map.toString(), JSON.stringify(map));
  };

  exports['test adding mappings (case 1)'] = function (assert, util) {
    var map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.'
    });

    assert.doesNotThrow(function () {
      map.addMapping({
        generated: { line: 1, column: 1 }
      });
    });
  };

  exports['test adding mappings (case 2)'] = function (assert, util) {
    var map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.'
    });

    assert.doesNotThrow(function () {
      map.addMapping({
        generated: { line: 1, column: 1 },
        source: 'bar.js',
        original: { line: 1, column: 1 }
      });
    });
  };

  exports['test adding mappings (case 3)'] = function (assert, util) {
    var map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.'
    });

    assert.doesNotThrow(function () {
      map.addMapping({
        generated: { line: 1, column: 1 },
        source: 'bar.js',
        original: { line: 1, column: 1 },
        name: 'someToken'
      });
    });
  };

  exports['test adding mappings (invalid)'] = function (assert, util) {
    var map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.'
    });

    // Not enough info.
    assert.throws(function () {
      map.addMapping({});
    });

    // Original file position, but no source.
    assert.throws(function () {
      map.addMapping({
        generated: { line: 1, column: 1 },
        original: { line: 1, column: 1 }
      });
    });
  };

  exports['test that the correct mappings are being generated'] = function (assert, util) {
    var map = new SourceMapGenerator({
      file: 'min.js',
      sourceRoot: '/the/root'
    });

    map.addMapping({
      generated: { line: 1, column: 1 },
      original: { line: 1, column: 1 },
      source: 'one.js'
    });
    map.addMapping({
      generated: { line: 1, column: 5 },
      original: { line: 1, column: 5 },
      source: 'one.js'
    });
    map.addMapping({
      generated: { line: 1, column: 9 },
      original: { line: 1, column: 11 },
      source: 'one.js'
    });
    map.addMapping({
      generated: { line: 1, column: 18 },
      original: { line: 1, column: 21 },
      source: 'one.js',
      name: 'bar'
    });
    map.addMapping({
      generated: { line: 1, column: 21 },
      original: { line: 2, column: 3 },
      source: 'one.js'
    });
    map.addMapping({
      generated: { line: 1, column: 28 },
      original: { line: 2, column: 10 },
      source: 'one.js',
      name: 'baz'
    });
    map.addMapping({
      generated: { line: 1, column: 32 },
      original: { line: 2, column: 14 },
      source: 'one.js',
      name: 'bar'
    });

    map.addMapping({
      generated: { line: 2, column: 1 },
      original: { line: 1, column: 1 },
      source: 'two.js'
    });
    map.addMapping({
      generated: { line: 2, column: 5 },
      original: { line: 1, column: 5 },
      source: 'two.js'
    });
    map.addMapping({
      generated: { line: 2, column: 9 },
      original: { line: 1, column: 11 },
      source: 'two.js'
    });
    map.addMapping({
      generated: { line: 2, column: 18 },
      original: { line: 1, column: 21 },
      source: 'two.js',
      name: 'n'
    });
    map.addMapping({
      generated: { line: 2, column: 21 },
      original: { line: 2, column: 3 },
      source: 'two.js'
    });
    map.addMapping({
      generated: { line: 2, column: 28 },
      original: { line: 2, column: 10 },
      source: 'two.js',
      name: 'n'
    });

    map = JSON.parse(map.toString());

    assert.equal(map.version, 3);
    assert.equal(map.file, 'min.js');
    assert.equal(map.names.length, 3);
    assert.equal(map.names[0], 'bar');
    assert.equal(map.names[1], 'baz');
    assert.equal(map.names[2], 'n');
    assert.equal(map.sources.length, 2);
    assert.equal(map.sources[0], 'one.js');
    assert.equal(map.sources[1], 'two.js');
    assert.equal(map.sourceRoot, '/the/root');
    assert.equal(map.mappings, 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA');
  };

});
