'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _estraverse = require('estraverse');

var _esrecurse = require('esrecurse');

var _esrecurse2 = _interopRequireDefault(_esrecurse);

var _reference = require('./reference');

var _reference2 = _interopRequireDefault(_reference);

var _variable = require('./variable');

var _variable2 = _interopRequireDefault(_variable);

var _patternVisitor = require('./pattern-visitor');

var _patternVisitor2 = _interopRequireDefault(_patternVisitor);

var _definition = require('./definition');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Redistribution and use in source and binary forms, with or without
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 modification, are permitted provided that the following conditions are met:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Redistributions of source code must retain the above copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     notice, this list of conditions and the following disclaimer.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Redistributions in binary form must reproduce the above copyright
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     notice, this list of conditions and the following disclaimer in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     documentation and/or other materials provided with the distribution.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


function traverseIdentifierInPattern(options, rootPattern, referencer, callback) {
    // Call the callback at left hand identifier nodes, and Collect right hand nodes.
    var visitor = new _patternVisitor2.default(options, rootPattern, callback);
    visitor.visit(rootPattern);

    // Process the right hand nodes recursively.
    if (referencer != null) {
        visitor.rightHandNodes.forEach(referencer.visit, referencer);
    }
}

// Importing ImportDeclaration.
// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-moduledeclarationinstantiation
// https://github.com/estree/estree/blob/master/es6.md#importdeclaration
// FIXME: Now, we don't create module environment, because the context is
// implementation dependent.

var Importer = function (_esrecurse$Visitor) {
    _inherits(Importer, _esrecurse$Visitor);

    function Importer(declaration, referencer) {
        _classCallCheck(this, Importer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Importer).call(this, null, referencer.options));

        _this.declaration = declaration;
        _this.referencer = referencer;
        return _this;
    }

    _createClass(Importer, [{
        key: 'visitImport',
        value: function visitImport(id, specifier) {
            var _this2 = this;

            this.referencer.visitPattern(id, function (pattern) {
                _this2.referencer.currentScope().__define(pattern, new _definition.Definition(_variable2.default.ImportBinding, pattern, specifier, _this2.declaration, null, null));
            });
        }
    }, {
        key: 'ImportNamespaceSpecifier',
        value: function ImportNamespaceSpecifier(node) {
            var local = node.local || node.id;
            if (local) {
                this.visitImport(local, node);
            }
        }
    }, {
        key: 'ImportDefaultSpecifier',
        value: function ImportDefaultSpecifier(node) {
            var local = node.local || node.id;
            this.visitImport(local, node);
        }
    }, {
        key: 'ImportSpecifier',
        value: function ImportSpecifier(node) {
            var local = node.local || node.id;
            if (node.name) {
                this.visitImport(node.name, node);
            } else {
                this.visitImport(local, node);
            }
        }
    }]);

    return Importer;
}(_esrecurse2.default.Visitor);

// Referencing variables and creating bindings.


var Referencer = function (_esrecurse$Visitor2) {
    _inherits(Referencer, _esrecurse$Visitor2);

    function Referencer(options, scopeManager) {
        _classCallCheck(this, Referencer);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Referencer).call(this, null, options));

        _this3.options = options;
        _this3.scopeManager = scopeManager;
        _this3.parent = null;
        _this3.isInnerMethodDefinition = false;
        return _this3;
    }

    _createClass(Referencer, [{
        key: 'currentScope',
        value: function currentScope() {
            return this.scopeManager.__currentScope;
        }
    }, {
        key: 'close',
        value: function close(node) {
            while (this.currentScope() && node === this.currentScope().block) {
                this.scopeManager.__currentScope = this.currentScope().__close(this.scopeManager);
            }
        }
    }, {
        key: 'pushInnerMethodDefinition',
        value: function pushInnerMethodDefinition(isInnerMethodDefinition) {
            var previous = this.isInnerMethodDefinition;
            this.isInnerMethodDefinition = isInnerMethodDefinition;
            return previous;
        }
    }, {
        key: 'popInnerMethodDefinition',
        value: function popInnerMethodDefinition(isInnerMethodDefinition) {
            this.isInnerMethodDefinition = isInnerMethodDefinition;
        }
    }, {
        key: 'materializeTDZScope',
        value: function materializeTDZScope(node, iterationNode) {
            // http://people.mozilla.org/~jorendorff/es6-draft.html#sec-runtime-semantics-forin-div-ofexpressionevaluation-abstract-operation
            // TDZ scope hides the declaration's names.
            this.scopeManager.__nestTDZScope(node, iterationNode);
            this.visitVariableDeclaration(this.currentScope(), _variable2.default.TDZ, iterationNode.left, 0, true);
        }
    }, {
        key: 'materializeIterationScope',
        value: function materializeIterationScope(node) {
            var _this4 = this;

            // Generate iteration scope for upper ForIn/ForOf Statements.
            var letOrConstDecl;
            this.scopeManager.__nestForScope(node);
            letOrConstDecl = node.left;
            this.visitVariableDeclaration(this.currentScope(), _variable2.default.Variable, letOrConstDecl, 0);
            this.visitPattern(letOrConstDecl.declarations[0].id, function (pattern) {
                _this4.currentScope().__referencing(pattern, _reference2.default.WRITE, node.right, null, true, true);
            });
        }
    }, {
        key: 'referencingDefaultValue',
        value: function referencingDefaultValue(pattern, assignments, maybeImplicitGlobal, init) {
            var scope = this.currentScope();
            assignments.forEach(function (assignment) {
                scope.__referencing(pattern, _reference2.default.WRITE, assignment.right, maybeImplicitGlobal, pattern !== assignment.left, init);
            });
        }
    }, {
        key: 'visitPattern',
        value: function visitPattern(node, options, callback) {
            if (typeof options === 'function') {
                callback = options;
                options = { processRightHandNodes: false };
            }
            traverseIdentifierInPattern(this.options, node, options.processRightHandNodes ? this : null, callback);
        }
    }, {
        key: 'visitFunction',
        value: function visitFunction(node) {
            var _this5 = this;

            var i, iz;
            // FunctionDeclaration name is defined in upper scope
            // NOTE: Not referring variableScope. It is intended.
            // Since
            //  in ES5, FunctionDeclaration should be in FunctionBody.
            //  in ES6, FunctionDeclaration should be block scoped.
            if (node.type === _estraverse.Syntax.FunctionDeclaration) {
                // id is defined in upper scope
                this.currentScope().__define(node.id, new _definition.Definition(_variable2.default.FunctionName, node.id, node, null, null, null));
            }

            // FunctionExpression with name creates its special scope;
            // FunctionExpressionNameScope.
            if (node.type === _estraverse.Syntax.FunctionExpression && node.id) {
                this.scopeManager.__nestFunctionExpressionNameScope(node);
            }

            // Consider this function is in the MethodDefinition.
            this.scopeManager.__nestFunctionScope(node, this.isInnerMethodDefinition);

            // Process parameter declarations.
            for (i = 0, iz = node.params.length; i < iz; ++i) {
                this.visitPattern(node.params[i], { processRightHandNodes: true }, function (pattern, info) {
                    _this5.currentScope().__define(pattern, new _definition.ParameterDefinition(pattern, node, i, info.rest));

                    _this5.referencingDefaultValue(pattern, info.assignments, null, true);
                });
            }

            // if there's a rest argument, add that
            if (node.rest) {
                this.visitPattern({
                    type: 'RestElement',
                    argument: node.rest
                }, function (pattern) {
                    _this5.currentScope().__define(pattern, new _definition.ParameterDefinition(pattern, node, node.params.length, true));
                });
            }

            // Skip BlockStatement to prevent creating BlockStatement scope.
            if (node.body.type === _estraverse.Syntax.BlockStatement) {
                this.visitChildren(node.body);
            } else {
                this.visit(node.body);
            }

            this.close(node);
        }
    }, {
        key: 'visitClass',
        value: function visitClass(node) {
            if (node.type === _estraverse.Syntax.ClassDeclaration) {
                this.currentScope().__define(node.id, new _definition.Definition(_variable2.default.ClassName, node.id, node, null, null, null));
            }

            // FIXME: Maybe consider TDZ.
            this.visit(node.superClass);

            this.scopeManager.__nestClassScope(node);

            if (node.id) {
                this.currentScope().__define(node.id, new _definition.Definition(_variable2.default.ClassName, node.id, node));
            }
            this.visit(node.body);

            this.close(node);
        }
    }, {
        key: 'visitProperty',
        value: function visitProperty(node) {
            var previous, isMethodDefinition;
            if (node.computed) {
                this.visit(node.key);
            }

            isMethodDefinition = node.type === _estraverse.Syntax.MethodDefinition;
            if (isMethodDefinition) {
                previous = this.pushInnerMethodDefinition(true);
            }
            this.visit(node.value);
            if (isMethodDefinition) {
                this.popInnerMethodDefinition(previous);
            }
        }
    }, {
        key: 'visitForIn',
        value: function visitForIn(node) {
            var _this6 = this;

            if (node.left.type === _estraverse.Syntax.VariableDeclaration && node.left.kind !== 'var') {
                this.materializeTDZScope(node.right, node);
                this.visit(node.right);
                this.close(node.right);

                this.materializeIterationScope(node);
                this.visit(node.body);
                this.close(node);
            } else {
                if (node.left.type === _estraverse.Syntax.VariableDeclaration) {
                    this.visit(node.left);
                    this.visitPattern(node.left.declarations[0].id, function (pattern) {
                        _this6.currentScope().__referencing(pattern, _reference2.default.WRITE, node.right, null, true, true);
                    });
                } else {
                    this.visitPattern(node.left, { processRightHandNodes: true }, function (pattern, info) {
                        var maybeImplicitGlobal = null;
                        if (!_this6.currentScope().isStrict) {
                            maybeImplicitGlobal = {
                                pattern: pattern,
                                node: node
                            };
                        }
                        _this6.referencingDefaultValue(pattern, info.assignments, maybeImplicitGlobal, false);
                        _this6.currentScope().__referencing(pattern, _reference2.default.WRITE, node.right, maybeImplicitGlobal, true, false);
                    });
                }
                this.visit(node.right);
                this.visit(node.body);
            }
        }
    }, {
        key: 'visitVariableDeclaration',
        value: function visitVariableDeclaration(variableTargetScope, type, node, index, fromTDZ) {
            var _this7 = this;

            // If this was called to initialize a TDZ scope, this needs to make definitions, but doesn't make references.
            var decl, init;

            decl = node.declarations[index];
            init = decl.init;
            this.visitPattern(decl.id, { processRightHandNodes: !fromTDZ }, function (pattern, info) {
                variableTargetScope.__define(pattern, new _definition.Definition(type, pattern, decl, node, index, node.kind));

                if (!fromTDZ) {
                    _this7.referencingDefaultValue(pattern, info.assignments, null, true);
                }
                if (init) {
                    _this7.currentScope().__referencing(pattern, _reference2.default.WRITE, init, null, !info.topLevel, true);
                }
            });
        }
    }, {
        key: 'AssignmentExpression',
        value: function AssignmentExpression(node) {
            var _this8 = this;

            if (_patternVisitor2.default.isPattern(node.left)) {
                if (node.operator === '=') {
                    this.visitPattern(node.left, { processRightHandNodes: true }, function (pattern, info) {
                        var maybeImplicitGlobal = null;
                        if (!_this8.currentScope().isStrict) {
                            maybeImplicitGlobal = {
                                pattern: pattern,
                                node: node
                            };
                        }
                        _this8.referencingDefaultValue(pattern, info.assignments, maybeImplicitGlobal, false);
                        _this8.currentScope().__referencing(pattern, _reference2.default.WRITE, node.right, maybeImplicitGlobal, !info.topLevel, false);
                    });
                } else {
                    this.currentScope().__referencing(node.left, _reference2.default.RW, node.right);
                }
            } else {
                this.visit(node.left);
            }
            this.visit(node.right);
        }
    }, {
        key: 'CatchClause',
        value: function CatchClause(node) {
            var _this9 = this;

            this.scopeManager.__nestCatchScope(node);

            this.visitPattern(node.param, { processRightHandNodes: true }, function (pattern, info) {
                _this9.currentScope().__define(pattern, new _definition.Definition(_variable2.default.CatchClause, node.param, node, null, null, null));
                _this9.referencingDefaultValue(pattern, info.assignments, null, true);
            });
            this.visit(node.body);

            this.close(node);
        }
    }, {
        key: 'Program',
        value: function Program(node) {
            this.scopeManager.__nestGlobalScope(node);

            if (this.scopeManager.__isNodejsScope()) {
                // Force strictness of GlobalScope to false when using node.js scope.
                this.currentScope().isStrict = false;
                this.scopeManager.__nestFunctionScope(node, false);
            }

            if (this.scopeManager.__isES6() && this.scopeManager.isModule()) {
                this.scopeManager.__nestModuleScope(node);
            }

            if (this.scopeManager.isStrictModeSupported() && this.scopeManager.isImpliedStrict()) {
                this.currentScope().isStrict = true;
            }

            this.visitChildren(node);
            this.close(node);
        }
    }, {
        key: 'Identifier',
        value: function Identifier(node) {
            this.currentScope().__referencing(node);
        }
    }, {
        key: 'UpdateExpression',
        value: function UpdateExpression(node) {
            if (_patternVisitor2.default.isPattern(node.argument)) {
                this.currentScope().__referencing(node.argument, _reference2.default.RW, null);
            } else {
                this.visitChildren(node);
            }
        }
    }, {
        key: 'MemberExpression',
        value: function MemberExpression(node) {
            this.visit(node.object);
            if (node.computed) {
                this.visit(node.property);
            }
        }
    }, {
        key: 'Property',
        value: function Property(node) {
            this.visitProperty(node);
        }
    }, {
        key: 'MethodDefinition',
        value: function MethodDefinition(node) {
            this.visitProperty(node);
        }
    }, {
        key: 'BreakStatement',
        value: function BreakStatement() {}
    }, {
        key: 'ContinueStatement',
        value: function ContinueStatement() {}
    }, {
        key: 'LabeledStatement',
        value: function LabeledStatement(node) {
            this.visit(node.body);
        }
    }, {
        key: 'ForStatement',
        value: function ForStatement(node) {
            // Create ForStatement declaration.
            // NOTE: In ES6, ForStatement dynamically generates
            // per iteration environment. However, escope is
            // a static analyzer, we only generate one scope for ForStatement.
            if (node.init && node.init.type === _estraverse.Syntax.VariableDeclaration && node.init.kind !== 'var') {
                this.scopeManager.__nestForScope(node);
            }

            this.visitChildren(node);

            this.close(node);
        }
    }, {
        key: 'ClassExpression',
        value: function ClassExpression(node) {
            this.visitClass(node);
        }
    }, {
        key: 'ClassDeclaration',
        value: function ClassDeclaration(node) {
            this.visitClass(node);
        }
    }, {
        key: 'CallExpression',
        value: function CallExpression(node) {
            // Check this is direct call to eval
            if (!this.scopeManager.__ignoreEval() && node.callee.type === _estraverse.Syntax.Identifier && node.callee.name === 'eval') {
                // NOTE: This should be `variableScope`. Since direct eval call always creates Lexical environment and
                // let / const should be enclosed into it. Only VariableDeclaration affects on the caller's environment.
                this.currentScope().variableScope.__detectEval();
            }
            this.visitChildren(node);
        }
    }, {
        key: 'BlockStatement',
        value: function BlockStatement(node) {
            if (this.scopeManager.__isES6()) {
                this.scopeManager.__nestBlockScope(node);
            }

            this.visitChildren(node);

            this.close(node);
        }
    }, {
        key: 'ThisExpression',
        value: function ThisExpression() {
            this.currentScope().variableScope.__detectThis();
        }
    }, {
        key: 'WithStatement',
        value: function WithStatement(node) {
            this.visit(node.object);
            // Then nest scope for WithStatement.
            this.scopeManager.__nestWithScope(node);

            this.visit(node.body);

            this.close(node);
        }
    }, {
        key: 'VariableDeclaration',
        value: function VariableDeclaration(node) {
            var variableTargetScope, i, iz, decl;
            variableTargetScope = node.kind === 'var' ? this.currentScope().variableScope : this.currentScope();
            for (i = 0, iz = node.declarations.length; i < iz; ++i) {
                decl = node.declarations[i];
                this.visitVariableDeclaration(variableTargetScope, _variable2.default.Variable, node, i);
                if (decl.init) {
                    this.visit(decl.init);
                }
            }
        }

        // sec 13.11.8

    }, {
        key: 'SwitchStatement',
        value: function SwitchStatement(node) {
            var i, iz;

            this.visit(node.discriminant);

            if (this.scopeManager.__isES6()) {
                this.scopeManager.__nestSwitchScope(node);
            }

            for (i = 0, iz = node.cases.length; i < iz; ++i) {
                this.visit(node.cases[i]);
            }

            this.close(node);
        }
    }, {
        key: 'FunctionDeclaration',
        value: function FunctionDeclaration(node) {
            this.visitFunction(node);
        }
    }, {
        key: 'FunctionExpression',
        value: function FunctionExpression(node) {
            this.visitFunction(node);
        }
    }, {
        key: 'ForOfStatement',
        value: function ForOfStatement(node) {
            this.visitForIn(node);
        }
    }, {
        key: 'ForInStatement',
        value: function ForInStatement(node) {
            this.visitForIn(node);
        }
    }, {
        key: 'ArrowFunctionExpression',
        value: function ArrowFunctionExpression(node) {
            this.visitFunction(node);
        }
    }, {
        key: 'ImportDeclaration',
        value: function ImportDeclaration(node) {
            var importer;

            (0, _assert2.default)(this.scopeManager.__isES6() && this.scopeManager.isModule(), 'ImportDeclaration should appear when the mode is ES6 and in the module context.');

            importer = new Importer(node, this);
            importer.visit(node);
        }
    }, {
        key: 'visitExportDeclaration',
        value: function visitExportDeclaration(node) {
            if (node.source) {
                return;
            }
            if (node.declaration) {
                this.visit(node.declaration);
                return;
            }

            this.visitChildren(node);
        }
    }, {
        key: 'ExportDeclaration',
        value: function ExportDeclaration(node) {
            this.visitExportDeclaration(node);
        }
    }, {
        key: 'ExportNamedDeclaration',
        value: function ExportNamedDeclaration(node) {
            this.visitExportDeclaration(node);
        }
    }, {
        key: 'ExportSpecifier',
        value: function ExportSpecifier(node) {
            var local = node.id || node.local;
            this.visit(local);
        }
    }, {
        key: 'MetaProperty',
        value: function MetaProperty() {
            // do nothing.
        }
    }]);

    return Referencer;
}(_esrecurse2.default.Visitor);

/* vim: set sw=4 ts=4 et tw=80 : */


exports.default = Referencer;
//# sourceMappingURL=data:application/json;base64,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a0I7YUFBdEI7O0FBS0EsaUJBQUssYUFBTCxDQUFtQixJQUFuQixFQVR5Qjs7OzswQ0FZWCxNQUFNO0FBQ3BCLGlCQUFLLHNCQUFMLENBQTRCLElBQTVCLEVBRG9COzs7OytDQUlELE1BQU07QUFDekIsaUJBQUssc0JBQUwsQ0FBNEIsSUFBNUIsRUFEeUI7Ozs7d0NBSWIsTUFBTTtBQUNsQixnQkFBSSxRQUFTLEtBQUssRUFBTCxJQUFXLEtBQUssS0FBTCxDQUROO0FBRWxCLGlCQUFLLEtBQUwsQ0FBVyxLQUFYLEVBRmtCOzs7O3VDQUtQOzs7OztXQXRlRTtFQUFtQixvQkFBVSxPQUFWOzs7OztrQkFBbkIiLCJmaWxlIjoicmVmZXJlbmNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gIENvcHlyaWdodCAoQykgMjAxNSBZdXN1a2UgU3V6dWtpIDx1dGF0YW5lLnRlYUBnbWFpbC5jb20+XG5cbiAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuXG4gICAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICAgICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcbiAgICAgIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG5cbiAgVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCJcbiAgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuICBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxuICBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgPENPUFlSSUdIVCBIT0xERVI+IEJFIExJQUJMRSBGT1IgQU5ZXG4gIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4gIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbiAgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EXG4gIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRlxuICBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuKi9cbmltcG9ydCB7IFN5bnRheCB9IGZyb20gJ2VzdHJhdmVyc2UnO1xuaW1wb3J0IGVzcmVjdXJzZSBmcm9tICdlc3JlY3Vyc2UnO1xuaW1wb3J0IFJlZmVyZW5jZSBmcm9tICcuL3JlZmVyZW5jZSc7XG5pbXBvcnQgVmFyaWFibGUgZnJvbSAnLi92YXJpYWJsZSc7XG5pbXBvcnQgUGF0dGVyblZpc2l0b3IgZnJvbSAnLi9wYXR0ZXJuLXZpc2l0b3InO1xuaW1wb3J0IHsgUGFyYW1ldGVyRGVmaW5pdGlvbiwgRGVmaW5pdGlvbiB9IGZyb20gJy4vZGVmaW5pdGlvbic7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5cbmZ1bmN0aW9uIHRyYXZlcnNlSWRlbnRpZmllckluUGF0dGVybihvcHRpb25zLCByb290UGF0dGVybiwgcmVmZXJlbmNlciwgY2FsbGJhY2spIHtcbiAgICAvLyBDYWxsIHRoZSBjYWxsYmFjayBhdCBsZWZ0IGhhbmQgaWRlbnRpZmllciBub2RlcywgYW5kIENvbGxlY3QgcmlnaHQgaGFuZCBub2Rlcy5cbiAgICB2YXIgdmlzaXRvciA9IG5ldyBQYXR0ZXJuVmlzaXRvcihvcHRpb25zLCByb290UGF0dGVybiwgY2FsbGJhY2spO1xuICAgIHZpc2l0b3IudmlzaXQocm9vdFBhdHRlcm4pO1xuXG4gICAgLy8gUHJvY2VzcyB0aGUgcmlnaHQgaGFuZCBub2RlcyByZWN1cnNpdmVseS5cbiAgICBpZiAocmVmZXJlbmNlciAhPSBudWxsKSB7XG4gICAgICAgIHZpc2l0b3IucmlnaHRIYW5kTm9kZXMuZm9yRWFjaChyZWZlcmVuY2VyLnZpc2l0LCByZWZlcmVuY2VyKTtcbiAgICB9XG59XG5cbi8vIEltcG9ydGluZyBJbXBvcnREZWNsYXJhdGlvbi5cbi8vIGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW1vZHVsZWRlY2xhcmF0aW9uaW5zdGFudGlhdGlvblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2VzdHJlZS9lc3RyZWUvYmxvYi9tYXN0ZXIvZXM2Lm1kI2ltcG9ydGRlY2xhcmF0aW9uXG4vLyBGSVhNRTogTm93LCB3ZSBkb24ndCBjcmVhdGUgbW9kdWxlIGVudmlyb25tZW50LCBiZWNhdXNlIHRoZSBjb250ZXh0IGlzXG4vLyBpbXBsZW1lbnRhdGlvbiBkZXBlbmRlbnQuXG5cbmNsYXNzIEltcG9ydGVyIGV4dGVuZHMgZXNyZWN1cnNlLlZpc2l0b3Ige1xuICAgIGNvbnN0cnVjdG9yKGRlY2xhcmF0aW9uLCByZWZlcmVuY2VyKSB7XG4gICAgICAgIHN1cGVyKG51bGwsIHJlZmVyZW5jZXIub3B0aW9ucyk7XG4gICAgICAgIHRoaXMuZGVjbGFyYXRpb24gPSBkZWNsYXJhdGlvbjtcbiAgICAgICAgdGhpcy5yZWZlcmVuY2VyID0gcmVmZXJlbmNlcjtcbiAgICB9XG5cbiAgICB2aXNpdEltcG9ydChpZCwgc3BlY2lmaWVyKSB7XG4gICAgICAgIHRoaXMucmVmZXJlbmNlci52aXNpdFBhdHRlcm4oaWQsIChwYXR0ZXJuKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlZmVyZW5jZXIuY3VycmVudFNjb3BlKCkuX19kZWZpbmUocGF0dGVybixcbiAgICAgICAgICAgICAgICBuZXcgRGVmaW5pdGlvbihcbiAgICAgICAgICAgICAgICAgICAgVmFyaWFibGUuSW1wb3J0QmluZGluZyxcbiAgICAgICAgICAgICAgICAgICAgcGF0dGVybixcbiAgICAgICAgICAgICAgICAgICAgc3BlY2lmaWVyLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlY2xhcmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXIobm9kZSkge1xuICAgICAgICBsZXQgbG9jYWwgPSAobm9kZS5sb2NhbCB8fCBub2RlLmlkKTtcbiAgICAgICAgaWYgKGxvY2FsKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0SW1wb3J0KGxvY2FsLCBub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEltcG9ydERlZmF1bHRTcGVjaWZpZXIobm9kZSkge1xuICAgICAgICBsZXQgbG9jYWwgPSAobm9kZS5sb2NhbCB8fCBub2RlLmlkKTtcbiAgICAgICAgdGhpcy52aXNpdEltcG9ydChsb2NhbCwgbm9kZSk7XG4gICAgfVxuXG4gICAgSW1wb3J0U3BlY2lmaWVyKG5vZGUpIHtcbiAgICAgICAgbGV0IGxvY2FsID0gKG5vZGUubG9jYWwgfHwgbm9kZS5pZCk7XG4gICAgICAgIGlmIChub2RlLm5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRJbXBvcnQobm9kZS5uYW1lLCBub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRJbXBvcnQobG9jYWwsIG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBSZWZlcmVuY2luZyB2YXJpYWJsZXMgYW5kIGNyZWF0aW5nIGJpbmRpbmdzLlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVmZXJlbmNlciBleHRlbmRzIGVzcmVjdXJzZS5WaXNpdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zLCBzY29wZU1hbmFnZXIpIHtcbiAgICAgICAgc3VwZXIobnVsbCwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuc2NvcGVNYW5hZ2VyID0gc2NvcGVNYW5hZ2VyO1xuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNJbm5lck1ldGhvZERlZmluaXRpb24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBjdXJyZW50U2NvcGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjb3BlTWFuYWdlci5fX2N1cnJlbnRTY29wZTtcbiAgICB9XG5cbiAgICBjbG9zZShub2RlKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLmN1cnJlbnRTY29wZSgpICYmIG5vZGUgPT09IHRoaXMuY3VycmVudFNjb3BlKCkuYmxvY2spIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVNYW5hZ2VyLl9fY3VycmVudFNjb3BlID0gdGhpcy5jdXJyZW50U2NvcGUoKS5fX2Nsb3NlKHRoaXMuc2NvcGVNYW5hZ2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1c2hJbm5lck1ldGhvZERlZmluaXRpb24oaXNJbm5lck1ldGhvZERlZmluaXRpb24pIHtcbiAgICAgICAgdmFyIHByZXZpb3VzID0gdGhpcy5pc0lubmVyTWV0aG9kRGVmaW5pdGlvbjtcbiAgICAgICAgdGhpcy5pc0lubmVyTWV0aG9kRGVmaW5pdGlvbiA9IGlzSW5uZXJNZXRob2REZWZpbml0aW9uO1xuICAgICAgICByZXR1cm4gcHJldmlvdXM7XG4gICAgfVxuXG4gICAgcG9wSW5uZXJNZXRob2REZWZpbml0aW9uKGlzSW5uZXJNZXRob2REZWZpbml0aW9uKSB7XG4gICAgICAgIHRoaXMuaXNJbm5lck1ldGhvZERlZmluaXRpb24gPSBpc0lubmVyTWV0aG9kRGVmaW5pdGlvbjtcbiAgICB9XG5cbiAgICBtYXRlcmlhbGl6ZVREWlNjb3BlKG5vZGUsIGl0ZXJhdGlvbk5vZGUpIHtcbiAgICAgICAgLy8gaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtcnVudGltZS1zZW1hbnRpY3MtZm9yaW4tZGl2LW9mZXhwcmVzc2lvbmV2YWx1YXRpb24tYWJzdHJhY3Qtb3BlcmF0aW9uXG4gICAgICAgIC8vIFREWiBzY29wZSBoaWRlcyB0aGUgZGVjbGFyYXRpb24ncyBuYW1lcy5cbiAgICAgICAgdGhpcy5zY29wZU1hbmFnZXIuX19uZXN0VERaU2NvcGUobm9kZSwgaXRlcmF0aW9uTm9kZSk7XG4gICAgICAgIHRoaXMudmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uKHRoaXMuY3VycmVudFNjb3BlKCksIFZhcmlhYmxlLlREWiwgaXRlcmF0aW9uTm9kZS5sZWZ0LCAwLCB0cnVlKTtcbiAgICB9XG5cbiAgICBtYXRlcmlhbGl6ZUl0ZXJhdGlvblNjb3BlKG5vZGUpIHtcbiAgICAgICAgLy8gR2VuZXJhdGUgaXRlcmF0aW9uIHNjb3BlIGZvciB1cHBlciBGb3JJbi9Gb3JPZiBTdGF0ZW1lbnRzLlxuICAgICAgICB2YXIgbGV0T3JDb25zdERlY2w7XG4gICAgICAgIHRoaXMuc2NvcGVNYW5hZ2VyLl9fbmVzdEZvclNjb3BlKG5vZGUpO1xuICAgICAgICBsZXRPckNvbnN0RGVjbCA9IG5vZGUubGVmdDtcbiAgICAgICAgdGhpcy52aXNpdFZhcmlhYmxlRGVjbGFyYXRpb24odGhpcy5jdXJyZW50U2NvcGUoKSwgVmFyaWFibGUuVmFyaWFibGUsIGxldE9yQ29uc3REZWNsLCAwKTtcbiAgICAgICAgdGhpcy52aXNpdFBhdHRlcm4obGV0T3JDb25zdERlY2wuZGVjbGFyYXRpb25zWzBdLmlkLCAocGF0dGVybikgPT4ge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NvcGUoKS5fX3JlZmVyZW5jaW5nKHBhdHRlcm4sIFJlZmVyZW5jZS5XUklURSwgbm9kZS5yaWdodCwgbnVsbCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlZmVyZW5jaW5nRGVmYXVsdFZhbHVlKHBhdHRlcm4sIGFzc2lnbm1lbnRzLCBtYXliZUltcGxpY2l0R2xvYmFsLCBpbml0KSB7XG4gICAgICAgIGNvbnN0IHNjb3BlID0gdGhpcy5jdXJyZW50U2NvcGUoKTtcbiAgICAgICAgYXNzaWdubWVudHMuZm9yRWFjaChhc3NpZ25tZW50ID0+IHtcbiAgICAgICAgICAgIHNjb3BlLl9fcmVmZXJlbmNpbmcoXG4gICAgICAgICAgICAgICAgcGF0dGVybixcbiAgICAgICAgICAgICAgICBSZWZlcmVuY2UuV1JJVEUsXG4gICAgICAgICAgICAgICAgYXNzaWdubWVudC5yaWdodCxcbiAgICAgICAgICAgICAgICBtYXliZUltcGxpY2l0R2xvYmFsLFxuICAgICAgICAgICAgICAgIHBhdHRlcm4gIT09IGFzc2lnbm1lbnQubGVmdCxcbiAgICAgICAgICAgICAgICBpbml0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmlzaXRQYXR0ZXJuKG5vZGUsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgICAgICAgICAgb3B0aW9ucyA9IHtwcm9jZXNzUmlnaHRIYW5kTm9kZXM6IGZhbHNlfVxuICAgICAgICB9XG4gICAgICAgIHRyYXZlcnNlSWRlbnRpZmllckluUGF0dGVybihcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBvcHRpb25zLnByb2Nlc3NSaWdodEhhbmROb2RlcyA/IHRoaXMgOiBudWxsLFxuICAgICAgICAgICAgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHZpc2l0RnVuY3Rpb24obm9kZSkge1xuICAgICAgICB2YXIgaSwgaXo7XG4gICAgICAgIC8vIEZ1bmN0aW9uRGVjbGFyYXRpb24gbmFtZSBpcyBkZWZpbmVkIGluIHVwcGVyIHNjb3BlXG4gICAgICAgIC8vIE5PVEU6IE5vdCByZWZlcnJpbmcgdmFyaWFibGVTY29wZS4gSXQgaXMgaW50ZW5kZWQuXG4gICAgICAgIC8vIFNpbmNlXG4gICAgICAgIC8vICBpbiBFUzUsIEZ1bmN0aW9uRGVjbGFyYXRpb24gc2hvdWxkIGJlIGluIEZ1bmN0aW9uQm9keS5cbiAgICAgICAgLy8gIGluIEVTNiwgRnVuY3Rpb25EZWNsYXJhdGlvbiBzaG91bGQgYmUgYmxvY2sgc2NvcGVkLlxuICAgICAgICBpZiAobm9kZS50eXBlID09PSBTeW50YXguRnVuY3Rpb25EZWNsYXJhdGlvbikge1xuICAgICAgICAgICAgLy8gaWQgaXMgZGVmaW5lZCBpbiB1cHBlciBzY29wZVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NvcGUoKS5fX2RlZmluZShub2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBuZXcgRGVmaW5pdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgIFZhcmlhYmxlLkZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRnVuY3Rpb25FeHByZXNzaW9uIHdpdGggbmFtZSBjcmVhdGVzIGl0cyBzcGVjaWFsIHNjb3BlO1xuICAgICAgICAvLyBGdW5jdGlvbkV4cHJlc3Npb25OYW1lU2NvcGUuXG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09IFN5bnRheC5GdW5jdGlvbkV4cHJlc3Npb24gJiYgbm9kZS5pZCkge1xuICAgICAgICAgICAgdGhpcy5zY29wZU1hbmFnZXIuX19uZXN0RnVuY3Rpb25FeHByZXNzaW9uTmFtZVNjb3BlKG5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29uc2lkZXIgdGhpcyBmdW5jdGlvbiBpcyBpbiB0aGUgTWV0aG9kRGVmaW5pdGlvbi5cbiAgICAgICAgdGhpcy5zY29wZU1hbmFnZXIuX19uZXN0RnVuY3Rpb25TY29wZShub2RlLCB0aGlzLmlzSW5uZXJNZXRob2REZWZpbml0aW9uKTtcblxuICAgICAgICAvLyBQcm9jZXNzIHBhcmFtZXRlciBkZWNsYXJhdGlvbnMuXG4gICAgICAgIGZvciAoaSA9IDAsIGl6ID0gbm9kZS5wYXJhbXMubGVuZ3RoOyBpIDwgaXo7ICsraSkge1xuICAgICAgICAgICAgdGhpcy52aXNpdFBhdHRlcm4obm9kZS5wYXJhbXNbaV0sIHtwcm9jZXNzUmlnaHRIYW5kTm9kZXM6IHRydWV9LCAocGF0dGVybiwgaW5mbykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNjb3BlKCkuX19kZWZpbmUocGF0dGVybixcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBhcmFtZXRlckRlZmluaXRpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvLnJlc3RcbiAgICAgICAgICAgICAgICAgICAgKSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlZmVyZW5jaW5nRGVmYXVsdFZhbHVlKHBhdHRlcm4sIGluZm8uYXNzaWdubWVudHMsIG51bGwsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGVyZSdzIGEgcmVzdCBhcmd1bWVudCwgYWRkIHRoYXRcbiAgICAgICAgaWYgKG5vZGUucmVzdCkge1xuICAgICAgICAgICAgdGhpcy52aXNpdFBhdHRlcm4oe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdSZXN0RWxlbWVudCcsXG4gICAgICAgICAgICAgICAgYXJndW1lbnQ6IG5vZGUucmVzdFxuICAgICAgICAgICAgfSwgKHBhdHRlcm4pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTY29wZSgpLl9fZGVmaW5lKHBhdHRlcm4sXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQYXJhbWV0ZXJEZWZpbml0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybixcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnBhcmFtcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTa2lwIEJsb2NrU3RhdGVtZW50IHRvIHByZXZlbnQgY3JlYXRpbmcgQmxvY2tTdGF0ZW1lbnQgc2NvcGUuXG4gICAgICAgIGlmIChub2RlLmJvZHkudHlwZSA9PT0gU3ludGF4LkJsb2NrU3RhdGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4obm9kZS5ib2R5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXQobm9kZS5ib2R5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xvc2Uobm9kZSk7XG4gICAgfVxuXG4gICAgdmlzaXRDbGFzcyhub2RlKSB7XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09IFN5bnRheC5DbGFzc0RlY2xhcmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY29wZSgpLl9fZGVmaW5lKG5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgIG5ldyBEZWZpbml0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgVmFyaWFibGUuQ2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGSVhNRTogTWF5YmUgY29uc2lkZXIgVERaLlxuICAgICAgICB0aGlzLnZpc2l0KG5vZGUuc3VwZXJDbGFzcyk7XG5cbiAgICAgICAgdGhpcy5zY29wZU1hbmFnZXIuX19uZXN0Q2xhc3NTY29wZShub2RlKTtcblxuICAgICAgICBpZiAobm9kZS5pZCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NvcGUoKS5fX2RlZmluZShub2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICBuZXcgRGVmaW5pdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgIFZhcmlhYmxlLkNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlXG4gICAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlzaXQobm9kZS5ib2R5KTtcblxuICAgICAgICB0aGlzLmNsb3NlKG5vZGUpO1xuICAgIH1cblxuICAgIHZpc2l0UHJvcGVydHkobm9kZSkge1xuICAgICAgICB2YXIgcHJldmlvdXMsIGlzTWV0aG9kRGVmaW5pdGlvbjtcbiAgICAgICAgaWYgKG5vZGUuY29tcHV0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXQobm9kZS5rZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNNZXRob2REZWZpbml0aW9uID0gbm9kZS50eXBlID09PSBTeW50YXguTWV0aG9kRGVmaW5pdGlvbjtcbiAgICAgICAgaWYgKGlzTWV0aG9kRGVmaW5pdGlvbikge1xuICAgICAgICAgICAgcHJldmlvdXMgPSB0aGlzLnB1c2hJbm5lck1ldGhvZERlZmluaXRpb24odHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aXNpdChub2RlLnZhbHVlKTtcbiAgICAgICAgaWYgKGlzTWV0aG9kRGVmaW5pdGlvbikge1xuICAgICAgICAgICAgdGhpcy5wb3BJbm5lck1ldGhvZERlZmluaXRpb24ocHJldmlvdXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmlzaXRGb3JJbihub2RlKSB7XG4gICAgICAgIGlmIChub2RlLmxlZnQudHlwZSA9PT0gU3ludGF4LlZhcmlhYmxlRGVjbGFyYXRpb24gJiYgbm9kZS5sZWZ0LmtpbmQgIT09ICd2YXInKSB7XG4gICAgICAgICAgICB0aGlzLm1hdGVyaWFsaXplVERaU2NvcGUobm9kZS5yaWdodCwgbm9kZSk7XG4gICAgICAgICAgICB0aGlzLnZpc2l0KG5vZGUucmlnaHQpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZShub2RlLnJpZ2h0KTtcblxuICAgICAgICAgICAgdGhpcy5tYXRlcmlhbGl6ZUl0ZXJhdGlvblNjb3BlKG5vZGUpO1xuICAgICAgICAgICAgdGhpcy52aXNpdChub2RlLmJvZHkpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZShub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChub2RlLmxlZnQudHlwZSA9PT0gU3ludGF4LlZhcmlhYmxlRGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpc2l0KG5vZGUubGVmdCk7XG4gICAgICAgICAgICAgICAgdGhpcy52aXNpdFBhdHRlcm4obm9kZS5sZWZ0LmRlY2xhcmF0aW9uc1swXS5pZCwgKHBhdHRlcm4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NvcGUoKS5fX3JlZmVyZW5jaW5nKHBhdHRlcm4sIFJlZmVyZW5jZS5XUklURSwgbm9kZS5yaWdodCwgbnVsbCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudmlzaXRQYXR0ZXJuKG5vZGUubGVmdCwge3Byb2Nlc3NSaWdodEhhbmROb2RlczogdHJ1ZX0sIChwYXR0ZXJuLCBpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXliZUltcGxpY2l0R2xvYmFsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRTY29wZSgpLmlzU3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXliZUltcGxpY2l0R2xvYmFsID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IHBhdHRlcm4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZmVyZW5jaW5nRGVmYXVsdFZhbHVlKHBhdHRlcm4sIGluZm8uYXNzaWdubWVudHMsIG1heWJlSW1wbGljaXRHbG9iYWwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NvcGUoKS5fX3JlZmVyZW5jaW5nKHBhdHRlcm4sIFJlZmVyZW5jZS5XUklURSwgbm9kZS5yaWdodCwgbWF5YmVJbXBsaWNpdEdsb2JhbCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy52aXNpdChub2RlLnJpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMudmlzaXQobm9kZS5ib2R5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbih2YXJpYWJsZVRhcmdldFNjb3BlLCB0eXBlLCBub2RlLCBpbmRleCwgZnJvbVREWikge1xuICAgICAgICAvLyBJZiB0aGlzIHdhcyBjYWxsZWQgdG8gaW5pdGlhbGl6ZSBhIFREWiBzY29wZSwgdGhpcyBuZWVkcyB0byBtYWtlIGRlZmluaXRpb25zLCBidXQgZG9lc24ndCBtYWtlIHJlZmVyZW5jZXMuXG4gICAgICAgIHZhciBkZWNsLCBpbml0O1xuXG4gICAgICAgIGRlY2wgPSBub2RlLmRlY2xhcmF0aW9uc1tpbmRleF07XG4gICAgICAgIGluaXQgPSBkZWNsLmluaXQ7XG4gICAgICAgIHRoaXMudmlzaXRQYXR0ZXJuKGRlY2wuaWQsIHtwcm9jZXNzUmlnaHRIYW5kTm9kZXM6ICFmcm9tVERafSwgKHBhdHRlcm4sIGluZm8pID0+IHtcbiAgICAgICAgICAgIHZhcmlhYmxlVGFyZ2V0U2NvcGUuX19kZWZpbmUocGF0dGVybixcbiAgICAgICAgICAgICAgICBuZXcgRGVmaW5pdGlvbihcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgcGF0dGVybixcbiAgICAgICAgICAgICAgICAgICAgZGVjbCxcbiAgICAgICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIG5vZGUua2luZFxuICAgICAgICAgICAgICAgICkpO1xuXG4gICAgICAgICAgICBpZiAoIWZyb21URFopIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZmVyZW5jaW5nRGVmYXVsdFZhbHVlKHBhdHRlcm4sIGluZm8uYXNzaWdubWVudHMsIG51bGwsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluaXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTY29wZSgpLl9fcmVmZXJlbmNpbmcocGF0dGVybiwgUmVmZXJlbmNlLldSSVRFLCBpbml0LCBudWxsLCAhaW5mby50b3BMZXZlbCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIEFzc2lnbm1lbnRFeHByZXNzaW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKFBhdHRlcm5WaXNpdG9yLmlzUGF0dGVybihub2RlLmxlZnQpKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5vcGVyYXRvciA9PT0gJz0nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52aXNpdFBhdHRlcm4obm9kZS5sZWZ0LCB7cHJvY2Vzc1JpZ2h0SGFuZE5vZGVzOiB0cnVlfSwgKHBhdHRlcm4sIGluZm8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heWJlSW1wbGljaXRHbG9iYWwgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY3VycmVudFNjb3BlKCkuaXNTdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heWJlSW1wbGljaXRHbG9iYWwgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogcGF0dGVybixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVmZXJlbmNpbmdEZWZhdWx0VmFsdWUocGF0dGVybiwgaW5mby5hc3NpZ25tZW50cywgbWF5YmVJbXBsaWNpdEdsb2JhbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTY29wZSgpLl9fcmVmZXJlbmNpbmcocGF0dGVybiwgUmVmZXJlbmNlLldSSVRFLCBub2RlLnJpZ2h0LCBtYXliZUltcGxpY2l0R2xvYmFsLCAhaW5mby50b3BMZXZlbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTY29wZSgpLl9fcmVmZXJlbmNpbmcobm9kZS5sZWZ0LCBSZWZlcmVuY2UuUlcsIG5vZGUucmlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy52aXNpdChub2RlLmxlZnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlzaXQobm9kZS5yaWdodCk7XG4gICAgfVxuXG4gICAgQ2F0Y2hDbGF1c2Uobm9kZSkge1xuICAgICAgICB0aGlzLnNjb3BlTWFuYWdlci5fX25lc3RDYXRjaFNjb3BlKG5vZGUpO1xuXG4gICAgICAgIHRoaXMudmlzaXRQYXR0ZXJuKG5vZGUucGFyYW0sIHtwcm9jZXNzUmlnaHRIYW5kTm9kZXM6IHRydWV9LCAocGF0dGVybiwgaW5mbykgPT4ge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NvcGUoKS5fX2RlZmluZShwYXR0ZXJuLFxuICAgICAgICAgICAgICAgIG5ldyBEZWZpbml0aW9uKFxuICAgICAgICAgICAgICAgICAgICBWYXJpYWJsZS5DYXRjaENsYXVzZSxcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5wYXJhbSxcbiAgICAgICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgdGhpcy5yZWZlcmVuY2luZ0RlZmF1bHRWYWx1ZShwYXR0ZXJuLCBpbmZvLmFzc2lnbm1lbnRzLCBudWxsLCB0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudmlzaXQobm9kZS5ib2R5KTtcblxuICAgICAgICB0aGlzLmNsb3NlKG5vZGUpO1xuICAgIH1cblxuICAgIFByb2dyYW0obm9kZSkge1xuICAgICAgICB0aGlzLnNjb3BlTWFuYWdlci5fX25lc3RHbG9iYWxTY29wZShub2RlKTtcblxuICAgICAgICBpZiAodGhpcy5zY29wZU1hbmFnZXIuX19pc05vZGVqc1Njb3BlKCkpIHtcbiAgICAgICAgICAgIC8vIEZvcmNlIHN0cmljdG5lc3Mgb2YgR2xvYmFsU2NvcGUgdG8gZmFsc2Ugd2hlbiB1c2luZyBub2RlLmpzIHNjb3BlLlxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NvcGUoKS5pc1N0cmljdCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zY29wZU1hbmFnZXIuX19uZXN0RnVuY3Rpb25TY29wZShub2RlLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zY29wZU1hbmFnZXIuX19pc0VTNigpICYmIHRoaXMuc2NvcGVNYW5hZ2VyLmlzTW9kdWxlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVNYW5hZ2VyLl9fbmVzdE1vZHVsZVNjb3BlKG5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2NvcGVNYW5hZ2VyLmlzU3RyaWN0TW9kZVN1cHBvcnRlZCgpICYmIHRoaXMuc2NvcGVNYW5hZ2VyLmlzSW1wbGllZFN0cmljdCgpKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY29wZSgpLmlzU3RyaWN0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihub2RlKTtcbiAgICAgICAgdGhpcy5jbG9zZShub2RlKTtcbiAgICB9XG5cbiAgICBJZGVudGlmaWVyKG5vZGUpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U2NvcGUoKS5fX3JlZmVyZW5jaW5nKG5vZGUpO1xuICAgIH1cblxuICAgIFVwZGF0ZUV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICBpZiAoUGF0dGVyblZpc2l0b3IuaXNQYXR0ZXJuKG5vZGUuYXJndW1lbnQpKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY29wZSgpLl9fcmVmZXJlbmNpbmcobm9kZS5hcmd1bWVudCwgUmVmZXJlbmNlLlJXLCBudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIE1lbWJlckV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICB0aGlzLnZpc2l0KG5vZGUub2JqZWN0KTtcbiAgICAgICAgaWYgKG5vZGUuY29tcHV0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXQobm9kZS5wcm9wZXJ0eSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQcm9wZXJ0eShub2RlKSB7XG4gICAgICAgIHRoaXMudmlzaXRQcm9wZXJ0eShub2RlKTtcbiAgICB9XG5cbiAgICBNZXRob2REZWZpbml0aW9uKG5vZGUpIHtcbiAgICAgICAgdGhpcy52aXNpdFByb3BlcnR5KG5vZGUpO1xuICAgIH1cblxuICAgIEJyZWFrU3RhdGVtZW50KCkge31cblxuICAgIENvbnRpbnVlU3RhdGVtZW50KCkge31cblxuICAgIExhYmVsZWRTdGF0ZW1lbnQobm9kZSkge1xuICAgICAgICB0aGlzLnZpc2l0KG5vZGUuYm9keSk7XG4gICAgfVxuXG4gICAgRm9yU3RhdGVtZW50KG5vZGUpIHtcbiAgICAgICAgLy8gQ3JlYXRlIEZvclN0YXRlbWVudCBkZWNsYXJhdGlvbi5cbiAgICAgICAgLy8gTk9URTogSW4gRVM2LCBGb3JTdGF0ZW1lbnQgZHluYW1pY2FsbHkgZ2VuZXJhdGVzXG4gICAgICAgIC8vIHBlciBpdGVyYXRpb24gZW52aXJvbm1lbnQuIEhvd2V2ZXIsIGVzY29wZSBpc1xuICAgICAgICAvLyBhIHN0YXRpYyBhbmFseXplciwgd2Ugb25seSBnZW5lcmF0ZSBvbmUgc2NvcGUgZm9yIEZvclN0YXRlbWVudC5cbiAgICAgICAgaWYgKG5vZGUuaW5pdCAmJiBub2RlLmluaXQudHlwZSA9PT0gU3ludGF4LlZhcmlhYmxlRGVjbGFyYXRpb24gJiYgbm9kZS5pbml0LmtpbmQgIT09ICd2YXInKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTWFuYWdlci5fX25lc3RGb3JTY29wZShub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihub2RlKTtcblxuICAgICAgICB0aGlzLmNsb3NlKG5vZGUpO1xuICAgIH1cblxuICAgIENsYXNzRXhwcmVzc2lvbihub2RlKSB7XG4gICAgICAgIHRoaXMudmlzaXRDbGFzcyhub2RlKTtcbiAgICB9XG5cbiAgICBDbGFzc0RlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgdGhpcy52aXNpdENsYXNzKG5vZGUpO1xuICAgIH1cblxuICAgIENhbGxFeHByZXNzaW9uKG5vZGUpIHtcbiAgICAgICAgLy8gQ2hlY2sgdGhpcyBpcyBkaXJlY3QgY2FsbCB0byBldmFsXG4gICAgICAgIGlmICghdGhpcy5zY29wZU1hbmFnZXIuX19pZ25vcmVFdmFsKCkgJiYgbm9kZS5jYWxsZWUudHlwZSA9PT0gU3ludGF4LklkZW50aWZpZXIgJiYgbm9kZS5jYWxsZWUubmFtZSA9PT0gJ2V2YWwnKSB7XG4gICAgICAgICAgICAvLyBOT1RFOiBUaGlzIHNob3VsZCBiZSBgdmFyaWFibGVTY29wZWAuIFNpbmNlIGRpcmVjdCBldmFsIGNhbGwgYWx3YXlzIGNyZWF0ZXMgTGV4aWNhbCBlbnZpcm9ubWVudCBhbmRcbiAgICAgICAgICAgIC8vIGxldCAvIGNvbnN0IHNob3VsZCBiZSBlbmNsb3NlZCBpbnRvIGl0LiBPbmx5IFZhcmlhYmxlRGVjbGFyYXRpb24gYWZmZWN0cyBvbiB0aGUgY2FsbGVyJ3MgZW52aXJvbm1lbnQuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY29wZSgpLnZhcmlhYmxlU2NvcGUuX19kZXRlY3RFdmFsKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aXNpdENoaWxkcmVuKG5vZGUpO1xuICAgIH1cblxuICAgIEJsb2NrU3RhdGVtZW50KG5vZGUpIHtcbiAgICAgICAgaWYgKHRoaXMuc2NvcGVNYW5hZ2VyLl9faXNFUzYoKSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZU1hbmFnZXIuX19uZXN0QmxvY2tTY29wZShub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlzaXRDaGlsZHJlbihub2RlKTtcblxuICAgICAgICB0aGlzLmNsb3NlKG5vZGUpO1xuICAgIH1cblxuICAgIFRoaXNFeHByZXNzaW9uKCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTY29wZSgpLnZhcmlhYmxlU2NvcGUuX19kZXRlY3RUaGlzKCk7XG4gICAgfVxuXG4gICAgV2l0aFN0YXRlbWVudChub2RlKSB7XG4gICAgICAgIHRoaXMudmlzaXQobm9kZS5vYmplY3QpO1xuICAgICAgICAvLyBUaGVuIG5lc3Qgc2NvcGUgZm9yIFdpdGhTdGF0ZW1lbnQuXG4gICAgICAgIHRoaXMuc2NvcGVNYW5hZ2VyLl9fbmVzdFdpdGhTY29wZShub2RlKTtcblxuICAgICAgICB0aGlzLnZpc2l0KG5vZGUuYm9keSk7XG5cbiAgICAgICAgdGhpcy5jbG9zZShub2RlKTtcbiAgICB9XG5cbiAgICBWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgdmFyIHZhcmlhYmxlVGFyZ2V0U2NvcGUsIGksIGl6LCBkZWNsO1xuICAgICAgICB2YXJpYWJsZVRhcmdldFNjb3BlID0gKG5vZGUua2luZCA9PT0gJ3ZhcicpID8gdGhpcy5jdXJyZW50U2NvcGUoKS52YXJpYWJsZVNjb3BlIDogdGhpcy5jdXJyZW50U2NvcGUoKTtcbiAgICAgICAgZm9yIChpID0gMCwgaXogPSBub2RlLmRlY2xhcmF0aW9ucy5sZW5ndGg7IGkgPCBpejsgKytpKSB7XG4gICAgICAgICAgICBkZWNsID0gbm9kZS5kZWNsYXJhdGlvbnNbaV07XG4gICAgICAgICAgICB0aGlzLnZpc2l0VmFyaWFibGVEZWNsYXJhdGlvbih2YXJpYWJsZVRhcmdldFNjb3BlLCBWYXJpYWJsZS5WYXJpYWJsZSwgbm9kZSwgaSk7XG4gICAgICAgICAgICBpZiAoZGVjbC5pbml0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy52aXNpdChkZWNsLmluaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gc2VjIDEzLjExLjhcbiAgICBTd2l0Y2hTdGF0ZW1lbnQobm9kZSkge1xuICAgICAgICB2YXIgaSwgaXo7XG5cbiAgICAgICAgdGhpcy52aXNpdChub2RlLmRpc2NyaW1pbmFudCk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2NvcGVNYW5hZ2VyLl9faXNFUzYoKSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZU1hbmFnZXIuX19uZXN0U3dpdGNoU2NvcGUobm9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBpeiA9IG5vZGUuY2FzZXMubGVuZ3RoOyBpIDwgaXo7ICsraSkge1xuICAgICAgICAgICAgdGhpcy52aXNpdChub2RlLmNhc2VzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xvc2Uobm9kZSk7XG4gICAgfVxuXG4gICAgRnVuY3Rpb25EZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIHRoaXMudmlzaXRGdW5jdGlvbihub2RlKTtcbiAgICB9XG5cbiAgICBGdW5jdGlvbkV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICB0aGlzLnZpc2l0RnVuY3Rpb24obm9kZSk7XG4gICAgfVxuXG4gICAgRm9yT2ZTdGF0ZW1lbnQobm9kZSkge1xuICAgICAgICB0aGlzLnZpc2l0Rm9ySW4obm9kZSk7XG4gICAgfVxuXG4gICAgRm9ySW5TdGF0ZW1lbnQobm9kZSkge1xuICAgICAgICB0aGlzLnZpc2l0Rm9ySW4obm9kZSk7XG4gICAgfVxuXG4gICAgQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24obm9kZSkge1xuICAgICAgICB0aGlzLnZpc2l0RnVuY3Rpb24obm9kZSk7XG4gICAgfVxuXG4gICAgSW1wb3J0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICB2YXIgaW1wb3J0ZXI7XG5cbiAgICAgICAgYXNzZXJ0KHRoaXMuc2NvcGVNYW5hZ2VyLl9faXNFUzYoKSAmJiB0aGlzLnNjb3BlTWFuYWdlci5pc01vZHVsZSgpLCAnSW1wb3J0RGVjbGFyYXRpb24gc2hvdWxkIGFwcGVhciB3aGVuIHRoZSBtb2RlIGlzIEVTNiBhbmQgaW4gdGhlIG1vZHVsZSBjb250ZXh0LicpO1xuXG4gICAgICAgIGltcG9ydGVyID0gbmV3IEltcG9ydGVyKG5vZGUsIHRoaXMpO1xuICAgICAgICBpbXBvcnRlci52aXNpdChub2RlKTtcbiAgICB9XG5cbiAgICB2aXNpdEV4cG9ydERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUuc291cmNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXQobm9kZS5kZWNsYXJhdGlvbik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnZpc2l0Q2hpbGRyZW4obm9kZSk7XG4gICAgfVxuXG4gICAgRXhwb3J0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICB0aGlzLnZpc2l0RXhwb3J0RGVjbGFyYXRpb24obm9kZSk7XG4gICAgfVxuXG4gICAgRXhwb3J0TmFtZWREZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIHRoaXMudmlzaXRFeHBvcnREZWNsYXJhdGlvbihub2RlKTtcbiAgICB9XG5cbiAgICBFeHBvcnRTcGVjaWZpZXIobm9kZSkge1xuICAgICAgICBsZXQgbG9jYWwgPSAobm9kZS5pZCB8fCBub2RlLmxvY2FsKTtcbiAgICAgICAgdGhpcy52aXNpdChsb2NhbCk7XG4gICAgfVxuXG4gICAgTWV0YVByb3BlcnR5KCkge1xuICAgICAgICAvLyBkbyBub3RoaW5nLlxuICAgIH1cbn1cblxuLyogdmltOiBzZXQgc3c9NCB0cz00IGV0IHR3PTgwIDogKi9cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
