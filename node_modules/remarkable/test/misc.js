/*global describe, it*/
'use strict';


var assert     = require('assert');
var Remarkable = require('../');
var utils      = require('../').utils;


describe('Utils', function () {

  it('fromCodePoint', function () {
    var fromCodePoint = require('../lib/common/utils').fromCodePoint;

    assert.strictEqual(fromCodePoint(0x20), ' ');
    assert.strictEqual(fromCodePoint(0x1F601), '😁');
  });

  it('isValidEntityCode', function () {
    var isValidEntityCode = require('../lib/common/utils').isValidEntityCode;

    assert.strictEqual(isValidEntityCode(0x20), true);
    assert.strictEqual(isValidEntityCode(0xD800), false);
    assert.strictEqual(isValidEntityCode(0xFDD0), false);
    assert.strictEqual(isValidEntityCode(0x1FFFF), false);
    assert.strictEqual(isValidEntityCode(0x1FFFE), false);
    assert.strictEqual(isValidEntityCode(0x00), false);
    assert.strictEqual(isValidEntityCode(0x0B), false);
    assert.strictEqual(isValidEntityCode(0x0E), false);
    assert.strictEqual(isValidEntityCode(0x7F), false);
  });

  it('replaceEntities', function () {
    var replaceEntities = require('../lib/common/utils').replaceEntities;

    assert.strictEqual(replaceEntities('&amp;'), '&');
    assert.strictEqual(replaceEntities('&#32;'), ' ');
    assert.strictEqual(replaceEntities('&#x20;'), ' ');
    assert.strictEqual(replaceEntities('&amp;&amp;'), '&&');

    assert.strictEqual(replaceEntities('&am;'), '&am;');
    assert.strictEqual(replaceEntities('&#00;'), '&#00;');
  });

  it('assign', function () {
    var assign = require('../lib/common/utils').assign;

    assert.deepEqual(assign({ a: 1 }, null, { b: 2 }), { a: 1, b: 2 });
    assert.throws(function () {
      assign({}, 123);
    });
  });

});


describe('API', function () {

  it('constructor', function () {
    assert.throws(function () {
      var md = new Remarkable('bad preset');
      md.render('123');
    });
  });

  it('configure coverage', function () {
    var md = new Remarkable('full');

    // conditions coverage
    md.configure({});

    assert.strictEqual(md.render('123'), '<p>123</p>\n');
  });

  it('plugin', function () {
    var succeeded = false;

    function plugin(instance, opts) { if (opts === 'bar') { succeeded = true; } }

    var md = new Remarkable();

    md.use(plugin, 'foo');
    assert.strictEqual(succeeded, false);
    md.use(plugin, 'bar');
    assert.strictEqual(succeeded, true);
  });

  it('highlight', function () {
    var md = new Remarkable({
      highlight: function (str) {
        return '==' + str + '==';
      }
    });

    assert.strictEqual(md.render('```\nhl\n```'), '<pre><code>==hl\n==</code></pre>\n');
  });

  it('highlight escape by default', function () {
    var md = new Remarkable({
      highlight: function () {
        return '';
      }
    });

    assert.strictEqual(md.render('```\n&\n```'), '<pre><code>&amp;\n</code></pre>\n');
  });

  it('force hardbreaks', function () {
    var md = new Remarkable({ breaks: true });

    assert.strictEqual(md.render('a\nb'), '<p>a<br>\nb</p>\n');
    md.set({ xhtmlOut: true });
    assert.strictEqual(md.render('a\nb'), '<p>a<br />\nb</p>\n');
  });

  it('xhtmlOut enabled', function () {
    var md = new Remarkable({ xhtmlOut: true });

    assert.strictEqual(md.render('---'), '<hr />\n');
    assert.strictEqual(md.render('![]()'), '<p><img src="" alt="" /></p>\n');
    assert.strictEqual(md.render('a  \\\nb'), '<p>a  <br />\nb</p>\n');
  });

  it('xhtmlOut disabled', function () {
    var md = new Remarkable();

    assert.strictEqual(md.render('---'), '<hr>\n');
    assert.strictEqual(md.render('![]()'), '<p><img src="" alt=""></p>\n');
    assert.strictEqual(md.render('a  \\\nb'), '<p>a  <br>\nb</p>\n');
  });

});


describe('Misc', function () {

  it('Should correctly parse strings without tailing \\n', function () {
    var md = new Remarkable();

    assert.strictEqual(md.render('123'), '<p>123</p>\n');
    assert.strictEqual(md.render('123\n'), '<p>123</p>\n');
  });

  it('Should quickly exit on empty string', function () {
    var md = new Remarkable();

    assert.strictEqual(md.render(''), '');
  });

  it('Should parse inlines only', function () {
    var md = new Remarkable('full');

    assert.strictEqual(md.renderInline('a *b* c'), 'a <em>b</em> c');
  });

  it('Renderer should have pluggable inline and block rules', function () {
    var md = new Remarkable();

    md.renderer.rules.em_open = function () { return '<it>'; };
    md.renderer.rules.em_close = function () { return '</it>'; };
    md.renderer.rules.paragraph_open = function () { return '<par>'; };
    md.renderer.rules.paragraph_close = function () { return '</par>'; };

    assert.strictEqual(md.render('*b*'), '<par><it>b</it></par>');
  });

});


describe('Links validation', function () {

  it('Override validator, disable everything', function () {
    var md = new Remarkable({ linkify: true });

    md.inline.validateLink = function () { return false; };

    assert.strictEqual(md.render('foo@example.com'), '<p>foo@example.com</p>\n');
    assert.strictEqual(md.render('http://example.com'), '<p>http://example.com</p>\n');
    assert.strictEqual(md.render('<foo@example.com>'), '<p>&lt;foo@example.com&gt;</p>\n');
    assert.strictEqual(md.render('<http://example.com>'), '<p>&lt;http://example.com&gt;</p>\n');
    assert.strictEqual(md.render('[test](http://example.com)'), '<p>[test](http://example.com)</p>\n');
  });

});

describe('Link target', function () {

  it('Should not have target when linkTarget is not defined', function () {
    var md = new Remarkable();

    assert.strictEqual(
      md.render('[test](http://example.com)'),
      '<p><a href="http://example.com">test</a></p>\n'
    );
  });

  it('Should not have target when linkTarget is empty', function () {
    var md = new Remarkable({ linkTarget: '' });

    assert.strictEqual(
      md.render('[test](http://example.com)'),
      '<p><a href="http://example.com">test</a></p>\n'
    );
  });

  it('Should add target to link when linkTarget is specified in options', function () {
    var md = new Remarkable({ linkTarget: '_blank' });

    assert.strictEqual(
      md.render('[test](http://example.com)'),
      '<p><a href="http://example.com" target="_blank">test</a></p>\n'
    );
  });

});


describe('Custom fences', function () {

  it('should render differently overriden rule', function () {
    var md = new Remarkable();

      md.renderer.rules.fence_custom.foo = function (tokens, idx, options, env, instance) {
      return '<div class="foo">' +
             utils.escapeHtml(tokens[idx].content) +
             '</div>' + instance.getBreak(tokens, idx);
    };

    var text = '```foo bar\n' +
               '123&45\n' +
               '```';
    assert.strictEqual(md.render(text), '<div class="foo">123&amp;45\n</div>\n');
  });

});
