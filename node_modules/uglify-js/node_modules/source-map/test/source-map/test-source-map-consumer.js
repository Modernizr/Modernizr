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

  var SourceMapConsumer = require('../../lib/source-map/source-map-consumer').SourceMapConsumer;

  exports['test that we can instantiate with a string or an objects'] = function (assert, util) {
    assert.doesNotThrow(function () {
      var map = new SourceMapConsumer(util.testMap);
    });
    assert.doesNotThrow(function () {
      var map = new SourceMapConsumer(JSON.stringify(util.testMap));
    });
  };

  exports['test that the `sources` field has the original sources'] = function (assert, util) {
    var map = new SourceMapConsumer(util.testMap);
    var sources = map.sources;

    assert.equal(sources[0], '/the/root/one.js');
    assert.equal(sources[1], '/the/root/two.js');
    assert.equal(sources.length, 2);
  };

  exports['test that the source root is reflected in a mapping\'s source field'] = function (assert, util) {
    var map = new SourceMapConsumer(util.testMap);
    var mapping;

    mapping = map.originalPositionFor({
      line: 2,
      column: 1
    });
    assert.equal(mapping.source, '/the/root/two.js');

    mapping = map.originalPositionFor({
      line: 1,
      column: 1
    });
    assert.equal(mapping.source, '/the/root/one.js');
  };

  exports['test mapping tokens back exactly'] = function (assert, util) {
    var map = new SourceMapConsumer(util.testMap);

    util.assertMapping(1, 1, '/the/root/one.js', 1, 1, null, map, assert);
    util.assertMapping(1, 5, '/the/root/one.js', 1, 5, null, map, assert);
    util.assertMapping(1, 9, '/the/root/one.js', 1, 11, null, map, assert);
    util.assertMapping(1, 18, '/the/root/one.js', 1, 21, 'bar', map, assert);
    util.assertMapping(1, 21, '/the/root/one.js', 2, 3, null, map, assert);
    util.assertMapping(1, 28, '/the/root/one.js', 2, 10, 'baz', map, assert);
    util.assertMapping(1, 32, '/the/root/one.js', 2, 14, 'bar', map, assert);

    util.assertMapping(2, 1, '/the/root/two.js', 1, 1, null, map, assert);
    util.assertMapping(2, 5, '/the/root/two.js', 1, 5, null, map, assert);
    util.assertMapping(2, 9, '/the/root/two.js', 1, 11, null, map, assert);
    util.assertMapping(2, 18, '/the/root/two.js', 1, 21, 'n', map, assert);
    util.assertMapping(2, 21, '/the/root/two.js', 2, 3, null, map, assert);
    util.assertMapping(2, 28, '/the/root/two.js', 2, 10, 'n', map, assert);
  };

  exports['test mapping tokens fuzzy'] = function (assert, util) {
    var map = new SourceMapConsumer(util.testMap);

    // Finding original positions
    util.assertMapping(1, 20, '/the/root/one.js', 1, 21, 'bar', map, assert, true);
    util.assertMapping(1, 30, '/the/root/one.js', 2, 10, 'baz', map, assert, true);
    util.assertMapping(2, 12, '/the/root/two.js', 1, 11, null, map, assert, true);

    // Finding generated positions
    util.assertMapping(1, 18, '/the/root/one.js', 1, 22, 'bar', map, assert, null, true);
    util.assertMapping(1, 28, '/the/root/one.js', 2, 13, 'baz', map, assert, null, true);
    util.assertMapping(2, 9, '/the/root/two.js', 1, 16, null, map, assert, null, true);
  };

  exports['test creating source map consumers with )]}\' prefix'] = function (assert, util) {
    assert.doesNotThrow(function () {
      var map = new SourceMapConsumer(")]}'" + JSON.stringify(util.testMap));
    });
  };

  exports['test eachMapping'] = function (assert, util) {
    var map = new SourceMapConsumer(util.testMap);
    var previousLine = -Infinity;
    var previousColumn = -Infinity;
    map.eachMapping(function (mapping) {
      assert.ok(mapping.generatedLine >= previousLine);

      if (mapping.generatedLine === previousLine) {
        assert.ok(mapping.generatedColumn >= previousColumn);
        previousColumn = mapping.generatedColumn;
      }
      else {
        previousLine = mapping.generatedLine;
        previousColumn = -Infinity;
      }
    });
  };

  exports['test iterating over mappings in a different order'] = function (assert, util) {
    var map = new SourceMapConsumer(util.testMap);
    var previousLine = -Infinity;
    var previousColumn = -Infinity;
    var previousSource = "";
    map.eachMapping(function (mapping) {
      assert.ok(mapping.source >= previousSource);

      if (mapping.source === previousSource) {
        assert.ok(mapping.originalLine >= previousLine);

        if (mapping.originalLine === previousLine) {
          assert.ok(mapping.originalColumn >= previousColumn);
          previousColumn = mapping.originalColumn;
        }
        else {
          previousLine = mapping.originalLine;
          previousColumn = -Infinity;
        }
      }
      else {
        previousSource = mapping.source;
        previousLine = -Infinity;
        previousColumn = -Infinity;
      }
    }, null, SourceMapConsumer.ORIGINAL_ORDER);
  };

  exports['test that we can set the context for `this` in eachMapping'] = function (assert, util) {
    var map = new SourceMapConsumer(util.testMap);
    var context = {};
    map.eachMapping(function () {
      assert.equal(this, context);
    }, context);
  };

});
