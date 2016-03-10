'use strict';

var Node = require('./node');

/**
 * Initialize a `Text` node with optional `line`.
 *
 * @param {String} line
 * @api public
 */

var Text = module.exports = function Text(line) {
  this.val = line;
};

// Inherit from `Node`.
Text.prototype = Object.create(Node.prototype);
Text.prototype.constructor = Text;

Text.prototype.type = 'Text';

/**
 * Flag as text.
 */

Text.prototype.isText = true;