'use strict';

var Node = module.exports = function Node(){};

/**
 * Clone this node (return itself)
 *
 * @return {Node}
 * @api private
 */

Node.prototype.clone = function(){
  var err = new Error('node.clone is deprecated and will be removed in v2.0.0');
  console.warn(err.stack);
  return this;
};

Node.prototype.type = '';
