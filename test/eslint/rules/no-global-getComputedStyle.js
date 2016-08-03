/**
 * @fileoverview Rule to disallow the use of getComputedStyle
 * @author Patrick Kettner
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'disallow use of getComputedStyle without checking if it is null first',
      category: 'Possible Errors',
      recommended: false
    }
  },
  create: function(context) {
    return {
      CallExpression: function (node) {
        if (node.callee.name === 'getComputedStyle') {
          context.report(node, 'Do not use getComputedStyle, import and use the "computedStyle" helper');
        }
      }
    };
  }
};
