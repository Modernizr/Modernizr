var path = require('path');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var btt = require('browserify-transform-tools');


module.exports = btt.makeStringTransform(
    'modernizr-transform'
  , {}
  , function(src, options, done) {
      src = transform(options.file, src);
      done(null, src);
    }
  );

function transform(sourcefile, src) {
  var ast = esprima.parse(src);

  var tast;

  function leave(node) {
    var callee = node.callee;
    if (!(callee &&
          node.type === 'CallExpression' &&
          callee.type === 'Identifier' &&
          callee.name === 'define')
        )
      return;

    // define(function() { })
    if (node.arguments.length === 1 &&
        node.arguments[0].type === 'FunctionExpression') {

      tast = generateModuleAst(
          [ ]
        , node.arguments[0]
        , sourcefile
        );

      this.break();

    } else

    // define([ ], function() { })
    if (node.arguments.length === 2 &&
        node.arguments[0].type === 'ArrayExpression' &&
        node.arguments[1].type === 'FunctionExpression') {

      tast = generateModuleAst(
          node.arguments[0].elements
        , node.arguments[1]
        , sourcefile
        );

      this.break();
    }
  }

  estraverse.replace(ast, { leave: leave });

  return escodegen.generate(tast || ast);
}


function generateModuleAst(deps, factory, sourcefile) {
  for (var dep, i = 0; i < deps.length; i++) {
    dep = deps[i].value;
    dep = rewriteDependencyPath(dep, sourcefile);
    dep = generateRequireAst(dep);
    deps[i] = dep;
  }

  var ast =
    { type: 'Program'
    , body:
      [ { 'type': 'ExpressionStatement'
        , 'expression':
          { 'type': 'AssignmentExpression'
          , 'operator': '='
          , 'left':
            { 'type': 'MemberExpression'
            , 'computed': false
            , 'object':
              { 'type': 'Identifier'
              , 'name': 'module'
              }
            , 'property':
              { 'type': 'Identifier'
              , 'name': 'exports'
              }
            }
          , 'right':
            { 'type': 'CallExpression'
            , 'callee': factory
            , 'arguments': deps
            }
          }
        }
      ]
    };
  return ast;
}

function rewriteDependencyPath(id, sourcefile) {
  var dir = sourcefile;
  var sourcedir;
  var depth = 0;
  while (dir !== '/') {
    dir = path.dirname(dir);
    sourcedir = path.basename(dir);
    depth++;

    if (sourcedir === 'feature-detects' || sourcedir === 'src')
      break;
  }

  if (sourcedir === 'feature-detects')
    if (/^test\//.test(id)) {
      return (new Array(depth)).join('../') + id.substr(5);
    } else {
      return (new Array(depth + 1)).join('../') + 'src/' + id;
    } else

  if (sourcedir === 'src') {
    if (/^test\//.test(id)) {
      return '../test/' + id;
    } else {
      return './' + id;
    }
  }

  throw new Error('Unexpected dependency `' + id + '`');
}

function generateRequireAst(dep) {
  var ast =
    { 'type': 'CallExpression'
    , 'callee':
      { 'type': 'Identifier'
      , 'name': 'require'
      }
    , 'arguments':
      [ { 'type': 'Literal'
        , 'value': dep
        }
      ]
    };
  return ast;
}
