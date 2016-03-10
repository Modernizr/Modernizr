'use strict'

var acorn = require('acorn');
var walk = require('acorn/dist/walk');

var lastSRC = '(null)';
var lastRes = true;
var lastConstants = undefined;

var STATEMENT_WHITE_LIST = {
  'EmptyStatement': true,
  'ExpressionStatement': true,
};
var EXPRESSION_WHITE_LIST = {
  'ParenthesizedExpression': true,
  'ArrayExpression': true,
  'ObjectExpression': true,
  'SequenceExpression': true,
  'TemplateLiteral': true,
  'UnaryExpression': true,
  'BinaryExpression': true,
  'LogicalExpression': true,
  'ConditionalExpression': true,
  'Identifier': true,
  'Literal': true,
  'ComprehensionExpression': true,
  'TaggedTemplateExpression': true,
  'MemberExpression': true,
  'CallExpression': true,
  'NewExpression': true,
};
module.exports = isConstant;
function isConstant(src, constants) {
  src = '(' + src + ')';
  if (lastSRC === src && lastConstants === constants) return lastRes;
  lastSRC = src;
  lastConstants = constants;
  if (!isExpression(src)) return lastRes = false;
  var ast;
  try {
    ast = acorn.parse(src, {
      ecmaVersion: 6,
      allowReturnOutsideFunction: true,
      allowImportExportEverywhere: true,
      allowHashBang: true
    });
  } catch (ex) {
    return lastRes = false;
  }
  var isConstant = true;
  walk.simple(ast, {
    Statement: function (node) {
      if (isConstant) {
        if (STATEMENT_WHITE_LIST[node.type] !== true) {
          isConstant = false;
        }
      }
    },
    Expression: function (node) {
      if (isConstant) {
        if (EXPRESSION_WHITE_LIST[node.type] !== true) {
          isConstant = false;
        }
      }
    },
    MemberExpression: function (node) {
      if (isConstant) {
        if (node.computed) isConstant = false;
        else if (node.property.name[0] === '_') isConstant = false;
      }
    },
    Identifier: function (node) {
      if (isConstant) {
        if (!constants || !(node.name in constants)) {
          isConstant = false;
        }
      }
    },
  });
  return lastRes = isConstant;
}
isConstant.isConstant = isConstant;

isConstant.toConstant = toConstant;
function toConstant(src, constants) {
  if (!isConstant(src, constants)) throw new Error(JSON.stringify(src) + ' is not constant.');
  return Function(Object.keys(constants || {}).join(','), 'return (' + src + ')').apply(null, Object.keys(constants || {}).map(function (key) {
    return constants[key];
  }));
}

function isExpression(src) {
  try {
    eval('throw "STOP"; (function () { return (' + src + '); })()');
    return false;
  }
  catch (err) {
    return err === 'STOP';
  }
}
