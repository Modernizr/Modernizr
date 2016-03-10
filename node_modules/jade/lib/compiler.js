'use strict';

var nodes = require('./nodes');
var filters = require('./filters');
var doctypes = require('./doctypes');
var runtime = require('./runtime');
var utils = require('./utils');
var selfClosing = require('void-elements');
var parseJSExpression = require('character-parser').parseMax;
var constantinople = require('constantinople');

function isConstant(src) {
  return constantinople(src, {jade: runtime, 'jade_interp': undefined});
}
function toConstant(src) {
  return constantinople.toConstant(src, {jade: runtime, 'jade_interp': undefined});
}
function errorAtNode(node, error) {
  error.line = node.line;
  error.filename = node.filename;
  return error;
}

/**
 * Initialize `Compiler` with the given `node`.
 *
 * @param {Node} node
 * @param {Object} options
 * @api public
 */

var Compiler = module.exports = function Compiler(node, options) {
  this.options = options = options || {};
  this.node = node;
  this.hasCompiledDoctype = false;
  this.hasCompiledTag = false;
  this.pp = options.pretty || false;
  if (this.pp && typeof this.pp !== 'string') {
    this.pp = '  ';
  }
  this.debug = false !== options.compileDebug;
  this.indents = 0;
  this.parentIndents = 0;
  this.terse = false;
  this.mixins = {};
  this.dynamicMixins = false;
  if (options.doctype) this.setDoctype(options.doctype);
};

/**
 * Compiler prototype.
 */

Compiler.prototype = {

  /**
   * Compile parse tree to JavaScript.
   *
   * @api public
   */

  compile: function(){
    this.buf = [];
    if (this.pp) this.buf.push("var jade_indent = [];");
    this.lastBufferedIdx = -1;
    this.visit(this.node);
    if (!this.dynamicMixins) {
      // if there are no dynamic mixins we can remove any un-used mixins
      var mixinNames = Object.keys(this.mixins);
      for (var i = 0; i < mixinNames.length; i++) {
        var mixin = this.mixins[mixinNames[i]];
        if (!mixin.used) {
          for (var x = 0; x < mixin.instances.length; x++) {
            for (var y = mixin.instances[x].start; y < mixin.instances[x].end; y++) {
              this.buf[y] = '';
            }
          }
        }
      }
    }
    return this.buf.join('\n');
  },

  /**
   * Sets the default doctype `name`. Sets terse mode to `true` when
   * html 5 is used, causing self-closing tags to end with ">" vs "/>",
   * and boolean attributes are not mirrored.
   *
   * @param {string} name
   * @api public
   */

  setDoctype: function(name){
    this.doctype = doctypes[name.toLowerCase()] || '<!DOCTYPE ' + name + '>';
    this.terse = this.doctype.toLowerCase() == '<!doctype html>';
    this.xml = 0 == this.doctype.indexOf('<?xml');
  },

  /**
   * Buffer the given `str` exactly as is or with interpolation
   *
   * @param {String} str
   * @param {Boolean} interpolate
   * @api public
   */

  buffer: function (str, interpolate) {
    var self = this;
    if (interpolate) {
      var match = /(\\)?([#!]){((?:.|\n)*)$/.exec(str);
      if (match) {
        this.buffer(str.substr(0, match.index), false);
        if (match[1]) { // escape
          this.buffer(match[2] + '{', false);
          this.buffer(match[3], true);
          return;
        } else {
          var rest = match[3];
          var range = parseJSExpression(rest);
          var code = ('!' == match[2] ? '' : 'jade.escape') + "((jade_interp = " + range.src + ") == null ? '' : jade_interp)";
          this.bufferExpression(code);
          this.buffer(rest.substr(range.end + 1), true);
          return;
        }
      }
    }

    str = utils.stringify(str);
    str = str.substr(1, str.length - 2);

    if (this.lastBufferedIdx == this.buf.length) {
      if (this.lastBufferedType === 'code') this.lastBuffered += ' + "';
      this.lastBufferedType = 'text';
      this.lastBuffered += str;
      this.buf[this.lastBufferedIdx - 1] = 'buf.push(' + this.bufferStartChar + this.lastBuffered + '");'
    } else {
      this.buf.push('buf.push("' + str + '");');
      this.lastBufferedType = 'text';
      this.bufferStartChar = '"';
      this.lastBuffered = str;
      this.lastBufferedIdx = this.buf.length;
    }
  },

  /**
   * Buffer the given `src` so it is evaluated at run time
   *
   * @param {String} src
   * @api public
   */

  bufferExpression: function (src) {
    if (isConstant(src)) {
      return this.buffer(toConstant(src) + '', false)
    }
    if (this.lastBufferedIdx == this.buf.length) {
      if (this.lastBufferedType === 'text') this.lastBuffered += '"';
      this.lastBufferedType = 'code';
      this.lastBuffered += ' + (' + src + ')';
      this.buf[this.lastBufferedIdx - 1] = 'buf.push(' + this.bufferStartChar + this.lastBuffered + ');'
    } else {
      this.buf.push('buf.push(' + src + ');');
      this.lastBufferedType = 'code';
      this.bufferStartChar = '';
      this.lastBuffered = '(' + src + ')';
      this.lastBufferedIdx = this.buf.length;
    }
  },

  /**
   * Buffer an indent based on the current `indent`
   * property and an additional `offset`.
   *
   * @param {Number} offset
   * @param {Boolean} newline
   * @api public
   */

  prettyIndent: function(offset, newline){
    offset = offset || 0;
    newline = newline ? '\n' : '';
    this.buffer(newline + Array(this.indents + offset).join(this.pp));
    if (this.parentIndents)
      this.buf.push("buf.push.apply(buf, jade_indent);");
  },

  /**
   * Visit `node`.
   *
   * @param {Node} node
   * @api public
   */

  visit: function(node){
    var debug = this.debug;

    if (debug) {
      this.buf.push('jade_debug.unshift(new jade.DebugItem( ' + node.line
        + ', ' + (node.filename
          ? utils.stringify(node.filename)
          : 'jade_debug[0].filename')
        + ' ));');
    }

    // Massive hack to fix our context
    // stack for - else[ if] etc
    if (false === node.debug && this.debug) {
      this.buf.pop();
      this.buf.pop();
    }

    this.visitNode(node);

    if (debug) this.buf.push('jade_debug.shift();');
  },

  /**
   * Visit `node`.
   *
   * @param {Node} node
   * @api public
   */

  visitNode: function(node){
    return this['visit' + node.type](node);
  },

  /**
   * Visit case `node`.
   *
   * @param {Literal} node
   * @api public
   */

  visitCase: function(node){
    var _ = this.withinCase;
    this.withinCase = true;
    this.buf.push('switch (' + node.expr + '){');
    this.visit(node.block);
    this.buf.push('}');
    this.withinCase = _;
  },

  /**
   * Visit when `node`.
   *
   * @param {Literal} node
   * @api public
   */

  visitWhen: function(node){
    if ('default' == node.expr) {
      this.buf.push('default:');
    } else {
      this.buf.push('case ' + node.expr + ':');
    }
    if (node.block) {
      this.visit(node.block);
      this.buf.push('  break;');
    }
  },

  /**
   * Visit literal `node`.
   *
   * @param {Literal} node
   * @api public
   */

  visitLiteral: function(node){
    this.buffer(node.str);
  },

  /**
   * Visit all nodes in `block`.
   *
   * @param {Block} block
   * @api public
   */

  visitBlock: function(block){
    var len = block.nodes.length
      , escape = this.escape
      , pp = this.pp

    // Pretty print multi-line text
    if (pp && len > 1 && !escape && block.nodes[0].isText && block.nodes[1].isText)
      this.prettyIndent(1, true);

    for (var i = 0; i < len; ++i) {
      // Pretty print text
      if (pp && i > 0 && !escape && block.nodes[i].isText && block.nodes[i-1].isText)
        this.prettyIndent(1, false);

      this.visit(block.nodes[i]);
      // Multiple text nodes are separated by newlines
      if (block.nodes[i+1] && block.nodes[i].isText && block.nodes[i+1].isText)
        this.buffer('\n');
    }
  },

  /**
   * Visit a mixin's `block` keyword.
   *
   * @param {MixinBlock} block
   * @api public
   */

  visitMixinBlock: function(block){
    if (this.pp) this.buf.push("jade_indent.push('" + Array(this.indents + 1).join(this.pp) + "');");
    this.buf.push('block && block();');
    if (this.pp) this.buf.push("jade_indent.pop();");
  },

  /**
   * Visit `doctype`. Sets terse mode to `true` when html 5
   * is used, causing self-closing tags to end with ">" vs "/>",
   * and boolean attributes are not mirrored.
   *
   * @param {Doctype} doctype
   * @api public
   */

  visitDoctype: function(doctype){
    if (doctype && (doctype.val || !this.doctype)) {
      this.setDoctype(doctype.val || 'default');
    }

    if (this.doctype) this.buffer(this.doctype);
    this.hasCompiledDoctype = true;
  },

  /**
   * Visit `mixin`, generating a function that
   * may be called within the template.
   *
   * @param {Mixin} mixin
   * @api public
   */

  visitMixin: function(mixin){
    var name = 'jade_mixins[';
    var args = mixin.args || '';
    var block = mixin.block;
    var attrs = mixin.attrs;
    var attrsBlocks = mixin.attributeBlocks.slice();
    var pp = this.pp;
    var dynamic = mixin.name[0]==='#';
    var key = mixin.name;
    if (dynamic) this.dynamicMixins = true;
    name += (dynamic ? mixin.name.substr(2,mixin.name.length-3):'"'+mixin.name+'"')+']';

    this.mixins[key] = this.mixins[key] || {used: false, instances: []};
    if (mixin.call) {
      this.mixins[key].used = true;
      if (pp) this.buf.push("jade_indent.push('" + Array(this.indents + 1).join(pp) + "');")
      if (block || attrs.length || attrsBlocks.length) {

        this.buf.push(name + '.call({');

        if (block) {
          this.buf.push('block: function(){');

          // Render block with no indents, dynamically added when rendered
          this.parentIndents++;
          var _indents = this.indents;
          this.indents = 0;
          this.visit(mixin.block);
          this.indents = _indents;
          this.parentIndents--;

          if (attrs.length || attrsBlocks.length) {
            this.buf.push('},');
          } else {
            this.buf.push('}');
          }
        }

        if (attrsBlocks.length) {
          if (attrs.length) {
            var val = this.attrs(attrs);
            attrsBlocks.unshift(val);
          }
          this.buf.push('attributes: jade.merge([' + attrsBlocks.join(',') + '])');
        } else if (attrs.length) {
          var val = this.attrs(attrs);
          this.buf.push('attributes: ' + val);
        }

        if (args) {
          this.buf.push('}, ' + args + ');');
        } else {
          this.buf.push('});');
        }

      } else {
        this.buf.push(name + '(' + args + ');');
      }
      if (pp) this.buf.push("jade_indent.pop();")
    } else {
      var mixin_start = this.buf.length;
      args = args ? args.split(',') : [];
      var rest;
      if (args.length && /^\.\.\./.test(args[args.length - 1].trim())) {
        rest = args.pop().trim().replace(/^\.\.\./, '');
      }
      // we need use jade_interp here for v8: https://code.google.com/p/v8/issues/detail?id=4165
      // once fixed, use this: this.buf.push(name + ' = function(' + args.join(',') + '){');
      this.buf.push(name + ' = jade_interp = function(' + args.join(',') + '){');
      this.buf.push('var block = (this && this.block), attributes = (this && this.attributes) || {};');
      if (rest) {
        this.buf.push('var ' + rest + ' = [];');
        this.buf.push('for (jade_interp = ' + args.length + '; jade_interp < arguments.length; jade_interp++) {');
        this.buf.push('  ' + rest + '.push(arguments[jade_interp]);');
        this.buf.push('}');
      }
      this.parentIndents++;
      this.visit(block);
      this.parentIndents--;
      this.buf.push('};');
      var mixin_end = this.buf.length;
      this.mixins[key].instances.push({start: mixin_start, end: mixin_end});
    }
  },

  /**
   * Visit `tag` buffering tag markup, generating
   * attributes, visiting the `tag`'s code and block.
   *
   * @param {Tag} tag
   * @api public
   */

  visitTag: function(tag){
    this.indents++;
    var name = tag.name
      , pp = this.pp
      , self = this;

    function bufferName() {
      if (tag.buffer) self.bufferExpression(name);
      else self.buffer(name);
    }

    if ('pre' == tag.name) this.escape = true;

    if (!this.hasCompiledTag) {
      if (!this.hasCompiledDoctype && 'html' == name) {
        this.visitDoctype();
      }
      this.hasCompiledTag = true;
    }

    // pretty print
    if (pp && !tag.isInline())
      this.prettyIndent(0, true);

    if (tag.selfClosing || (!this.xml && selfClosing[tag.name])) {
      this.buffer('<');
      bufferName();
      this.visitAttributes(tag.attrs, tag.attributeBlocks.slice());
      this.terse
        ? this.buffer('>')
        : this.buffer('/>');
      // if it is non-empty throw an error
      if (tag.block &&
          !(tag.block.type === 'Block' && tag.block.nodes.length === 0) &&
          tag.block.nodes.some(function (tag) {
            return tag.type !== 'Text' || !/^\s*$/.test(tag.val)
          })) {
        throw errorAtNode(tag, new Error(name + ' is self closing and should not have content.'));
      }
    } else {
      // Optimize attributes buffering
      this.buffer('<');
      bufferName();
      this.visitAttributes(tag.attrs, tag.attributeBlocks.slice());
      this.buffer('>');
      if (tag.code) this.visitCode(tag.code);
      this.visit(tag.block);

      // pretty print
      if (pp && !tag.isInline() && 'pre' != tag.name && !tag.canInline())
        this.prettyIndent(0, true);

      this.buffer('</');
      bufferName();
      this.buffer('>');
    }

    if ('pre' == tag.name) this.escape = false;

    this.indents--;
  },

  /**
   * Visit `filter`, throwing when the filter does not exist.
   *
   * @param {Filter} filter
   * @api public
   */

  visitFilter: function(filter){
    var text = filter.block.nodes.map(
      function(node){ return node.val; }
    ).join('\n');
    filter.attrs.filename = this.options.filename;
    try {
      this.buffer(filters(filter.name, text, filter.attrs), true);
    } catch (err) {
      throw errorAtNode(filter, err);
    }
  },

  /**
   * Visit `text` node.
   *
   * @param {Text} text
   * @api public
   */

  visitText: function(text){
    this.buffer(text.val, true);
  },

  /**
   * Visit a `comment`, only buffering when the buffer flag is set.
   *
   * @param {Comment} comment
   * @api public
   */

  visitComment: function(comment){
    if (!comment.buffer) return;
    if (this.pp) this.prettyIndent(1, true);
    this.buffer('<!--' + comment.val + '-->');
  },

  /**
   * Visit a `BlockComment`.
   *
   * @param {Comment} comment
   * @api public
   */

  visitBlockComment: function(comment){
    if (!comment.buffer) return;
    if (this.pp) this.prettyIndent(1, true);
    this.buffer('<!--' + comment.val);
    this.visit(comment.block);
    if (this.pp) this.prettyIndent(1, true);
    this.buffer('-->');
  },

  /**
   * Visit `code`, respecting buffer / escape flags.
   * If the code is followed by a block, wrap it in
   * a self-calling function.
   *
   * @param {Code} code
   * @api public
   */

  visitCode: function(code){
    // Wrap code blocks with {}.
    // we only wrap unbuffered code blocks ATM
    // since they are usually flow control

    // Buffer code
    if (code.buffer) {
      var val = code.val.trim();
      val = 'null == (jade_interp = '+val+') ? "" : jade_interp';
      if (code.escape) val = 'jade.escape(' + val + ')';
      this.bufferExpression(val);
    } else {
      this.buf.push(code.val);
    }

    // Block support
    if (code.block) {
      if (!code.buffer) this.buf.push('{');
      this.visit(code.block);
      if (!code.buffer) this.buf.push('}');
    }
  },

  /**
   * Visit `each` block.
   *
   * @param {Each} each
   * @api public
   */

  visitEach: function(each){
    this.buf.push(''
      + '// iterate ' + each.obj + '\n'
      + ';(function(){\n'
      + '  var $$obj = ' + each.obj + ';\n'
      + '  if (\'number\' == typeof $$obj.length) {\n');

    if (each.alternative) {
      this.buf.push('  if ($$obj.length) {');
    }

    this.buf.push(''
      + '    for (var ' + each.key + ' = 0, $$l = $$obj.length; ' + each.key + ' < $$l; ' + each.key + '++) {\n'
      + '      var ' + each.val + ' = $$obj[' + each.key + '];\n');

    this.visit(each.block);

    this.buf.push('    }\n');

    if (each.alternative) {
      this.buf.push('  } else {');
      this.visit(each.alternative);
      this.buf.push('  }');
    }

    this.buf.push(''
      + '  } else {\n'
      + '    var $$l = 0;\n'
      + '    for (var ' + each.key + ' in $$obj) {\n'
      + '      $$l++;'
      + '      var ' + each.val + ' = $$obj[' + each.key + '];\n');

    this.visit(each.block);

    this.buf.push('    }\n');
    if (each.alternative) {
      this.buf.push('    if ($$l === 0) {');
      this.visit(each.alternative);
      this.buf.push('    }');
    }
    this.buf.push('  }\n}).call(this);\n');
  },

  /**
   * Visit `attrs`.
   *
   * @param {Array} attrs
   * @api public
   */

  visitAttributes: function(attrs, attributeBlocks){
    if (attributeBlocks.length) {
      if (attrs.length) {
        var val = this.attrs(attrs);
        attributeBlocks.unshift(val);
      }
      this.bufferExpression('jade.attrs(jade.merge([' + attributeBlocks.join(',') + ']), ' + utils.stringify(this.terse) + ')');
    } else if (attrs.length) {
      this.attrs(attrs, true);
    }
  },

  /**
   * Compile attributes.
   */

  attrs: function(attrs, buffer){
    var buf = [];
    var classes = [];
    var classEscaping = [];

    attrs.forEach(function(attr){
      var key = attr.name;
      var escaped = attr.escaped;

      if (key === 'class') {
        classes.push(attr.val);
        classEscaping.push(attr.escaped);
      } else if (isConstant(attr.val)) {
        if (buffer) {
          this.buffer(runtime.attr(key, toConstant(attr.val), escaped, this.terse));
        } else {
          var val = toConstant(attr.val);
          if (key === 'style') val = runtime.style(val);
          if (escaped && !(key.indexOf('data') === 0 && typeof val !== 'string')) {
            val = runtime.escape(val);
          }
          buf.push(utils.stringify(key) + ': ' + utils.stringify(val));
        }
      } else {
        if (buffer) {
          this.bufferExpression('jade.attr("' + key + '", ' + attr.val + ', ' + utils.stringify(escaped) + ', ' + utils.stringify(this.terse) + ')');
        } else {
          var val = attr.val;
          if (key === 'style') {
            val = 'jade.style(' + val + ')';
          }
          if (escaped && !(key.indexOf('data') === 0)) {
            val = 'jade.escape(' + val + ')';
          } else if (escaped) {
            val = '(typeof (jade_interp = ' + val + ') == "string" ? jade.escape(jade_interp) : jade_interp)';
          }
          buf.push(utils.stringify(key) + ': ' + val);
        }
      }
    }.bind(this));
    if (buffer) {
      if (classes.every(isConstant)) {
        this.buffer(runtime.cls(classes.map(toConstant), classEscaping));
      } else {
        this.bufferExpression('jade.cls([' + classes.join(',') + '], ' + utils.stringify(classEscaping) + ')');
      }
    } else if (classes.length) {
      if (classes.every(isConstant)) {
        classes = utils.stringify(runtime.joinClasses(classes.map(toConstant).map(runtime.joinClasses).map(function (cls, i) {
          return classEscaping[i] ? runtime.escape(cls) : cls;
        })));
      } else {
        classes = '(jade_interp = ' + utils.stringify(classEscaping) + ',' +
          ' jade.joinClasses([' + classes.join(',') + '].map(jade.joinClasses).map(function (cls, i) {' +
          '   return jade_interp[i] ? jade.escape(cls) : cls' +
          ' }))' +
          ')';
      }
      if (classes.length)
        buf.push('"class": ' + classes);
    }
    return '{' + buf.join(',') + '}';
  }
};
