'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ScopeManager = exports.Scope = exports.Variable = exports.Reference = exports.version = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                    Copyright (C) 2012-2014 Yusuke Suzuki <utatane.tea@gmail.com>
                                                                                                                                                                                                                                                    Copyright (C) 2013 Alex Seville <hi@alexanderseville.com>
                                                                                                                                                                                                                                                    Copyright (C) 2014 Thiago de Arruda <tpadilha84@gmail.com>
                                                                                                                                                                                                                                                  
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

/**
 * Escope (<a href="http://github.com/estools/escope">escope</a>) is an <a
 * href="http://www.ecma-international.org/publications/standards/Ecma-262.htm">ECMAScript</a>
 * scope analyzer extracted from the <a
 * href="http://github.com/estools/esmangle">esmangle project</a/>.
 * <p>
 * <em>escope</em> finds lexical scopes in a source program, i.e. areas of that
 * program where different occurrences of the same identifier refer to the same
 * variable. With each scope the contained variables are collected, and each
 * identifier reference in code is linked to its corresponding variable (if
 * possible).
 * <p>
 * <em>escope</em> works on a syntax tree of the parsed source code which has
 * to adhere to the <a
 * href="https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API">
 * Mozilla Parser API</a>. E.g. <a href="http://esprima.org">esprima</a> is a parser
 * that produces such syntax trees.
 * <p>
 * The main interface is the {@link analyze} function.
 * @module escope
 */

/*jslint bitwise:true */

exports.analyze = analyze;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _scopeManager = require('./scope-manager');

var _scopeManager2 = _interopRequireDefault(_scopeManager);

var _referencer = require('./referencer');

var _referencer2 = _interopRequireDefault(_referencer);

var _reference = require('./reference');

var _reference2 = _interopRequireDefault(_reference);

var _variable = require('./variable');

var _variable2 = _interopRequireDefault(_variable);

var _scope = require('./scope');

var _scope2 = _interopRequireDefault(_scope);

var _package = require('../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultOptions() {
    return {
        optimistic: false,
        directive: false,
        nodejsScope: false,
        impliedStrict: false,
        sourceType: 'script', // one of ['script', 'module']
        ecmaVersion: 5,
        childVisitorKeys: null,
        fallback: 'iteration'
    };
}

function updateDeeply(target, override) {
    var key, val;

    function isHashObject(target) {
        return (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target instanceof Object && !(target instanceof Array) && !(target instanceof RegExp);
    }

    for (key in override) {
        if (override.hasOwnProperty(key)) {
            val = override[key];
            if (isHashObject(val)) {
                if (isHashObject(target[key])) {
                    updateDeeply(target[key], val);
                } else {
                    target[key] = updateDeeply({}, val);
                }
            } else {
                target[key] = val;
            }
        }
    }
    return target;
}

/**
 * Main interface function. Takes an Esprima syntax tree and returns the
 * analyzed scopes.
 * @function analyze
 * @param {esprima.Tree} tree
 * @param {Object} providedOptions - Options that tailor the scope analysis
 * @param {boolean} [providedOptions.optimistic=false] - the optimistic flag
 * @param {boolean} [providedOptions.directive=false]- the directive flag
 * @param {boolean} [providedOptions.ignoreEval=false]- whether to check 'eval()' calls
 * @param {boolean} [providedOptions.nodejsScope=false]- whether the whole
 * script is executed under node.js environment. When enabled, escope adds
 * a function scope immediately following the global scope.
 * @param {boolean} [providedOptions.impliedStrict=false]- implied strict mode
 * (if ecmaVersion >= 5).
 * @param {string} [providedOptions.sourceType='script']- the source type of the script. one of 'script' and 'module'
 * @param {number} [providedOptions.ecmaVersion=5]- which ECMAScript version is considered
 * @param {Object} [providedOptions.childVisitorKeys=null] - Additional known visitor keys. See [esrecurse](https://github.com/estools/esrecurse)'s the `childVisitorKeys` option.
 * @param {string} [providedOptions.fallback='iteration'] - A kind of the fallback in order to encounter with unknown node. See [esrecurse](https://github.com/estools/esrecurse)'s the `fallback` option.
 * @return {ScopeManager}
 */
function analyze(tree, providedOptions) {
    var scopeManager, referencer, options;

    options = updateDeeply(defaultOptions(), providedOptions);

    scopeManager = new _scopeManager2.default(options);

    referencer = new _referencer2.default(options, scopeManager);
    referencer.visit(tree);

    (0, _assert2.default)(scopeManager.__currentScope === null, 'currentScope should be null.');

    return scopeManager;
}

exports.
/** @name module:escope.version */
version = _package.version;
exports.
/** @name module:escope.Reference */
Reference = _reference2.default;
exports.
/** @name module:escope.Variable */
Variable = _variable2.default;
exports.
/** @name module:escope.Scope */
Scope = _scope2.default;
exports.
/** @name module:escope.ScopeManager */
ScopeManager = _scopeManager2.default;

/* vim: set sw=4 ts=4 et tw=80 : */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQW9IZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXpEaEIsU0FBUyxjQUFULEdBQTBCO0FBQ3RCLFdBQU87QUFDSCxvQkFBWSxLQUFaO0FBQ0EsbUJBQVcsS0FBWDtBQUNBLHFCQUFhLEtBQWI7QUFDQSx1QkFBZSxLQUFmO0FBQ0Esb0JBQVksUUFBWjtBQUNBLHFCQUFhLENBQWI7QUFDQSwwQkFBa0IsSUFBbEI7QUFDQSxrQkFBVSxXQUFWO0tBUkosQ0FEc0I7Q0FBMUI7O0FBYUEsU0FBUyxZQUFULENBQXNCLE1BQXRCLEVBQThCLFFBQTlCLEVBQXdDO0FBQ3BDLFFBQUksR0FBSixFQUFTLEdBQVQsQ0FEb0M7O0FBR3BDLGFBQVMsWUFBVCxDQUFzQixNQUF0QixFQUE4QjtBQUMxQixlQUFPLFFBQU8sdURBQVAsS0FBa0IsUUFBbEIsSUFBOEIsa0JBQWtCLE1BQWxCLElBQTRCLEVBQUUsa0JBQWtCLEtBQWxCLENBQUYsSUFBOEIsRUFBRSxrQkFBa0IsTUFBbEIsQ0FBRixDQURyRTtLQUE5Qjs7QUFJQSxTQUFLLEdBQUwsSUFBWSxRQUFaLEVBQXNCO0FBQ2xCLFlBQUksU0FBUyxjQUFULENBQXdCLEdBQXhCLENBQUosRUFBa0M7QUFDOUIsa0JBQU0sU0FBUyxHQUFULENBQU4sQ0FEOEI7QUFFOUIsZ0JBQUksYUFBYSxHQUFiLENBQUosRUFBdUI7QUFDbkIsb0JBQUksYUFBYSxPQUFPLEdBQVAsQ0FBYixDQUFKLEVBQStCO0FBQzNCLGlDQUFhLE9BQU8sR0FBUCxDQUFiLEVBQTBCLEdBQTFCLEVBRDJCO2lCQUEvQixNQUVPO0FBQ0gsMkJBQU8sR0FBUCxJQUFjLGFBQWEsRUFBYixFQUFpQixHQUFqQixDQUFkLENBREc7aUJBRlA7YUFESixNQU1PO0FBQ0gsdUJBQU8sR0FBUCxJQUFjLEdBQWQsQ0FERzthQU5QO1NBRko7S0FESjtBQWNBLFdBQU8sTUFBUCxDQXJCb0M7Q0FBeEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0Q08sU0FBUyxPQUFULENBQWlCLElBQWpCLEVBQXVCLGVBQXZCLEVBQXdDO0FBQzNDLFFBQUksWUFBSixFQUFrQixVQUFsQixFQUE4QixPQUE5QixDQUQyQzs7QUFHM0MsY0FBVSxhQUFhLGdCQUFiLEVBQStCLGVBQS9CLENBQVYsQ0FIMkM7O0FBSzNDLG1CQUFlLDJCQUFpQixPQUFqQixDQUFmLENBTDJDOztBQU8zQyxpQkFBYSx5QkFBZSxPQUFmLEVBQXdCLFlBQXhCLENBQWIsQ0FQMkM7QUFRM0MsZUFBVyxLQUFYLENBQWlCLElBQWpCLEVBUjJDOztBQVUzQywwQkFBTyxhQUFhLGNBQWIsS0FBZ0MsSUFBaEMsRUFBc0MsOEJBQTdDLEVBVjJDOztBQVkzQyxXQUFPLFlBQVAsQ0FaMkM7Q0FBeEM7Ozs7QUFpQkg7OztBQUVBOzs7QUFFQTs7O0FBRUE7OztBQUVBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAgQ29weXJpZ2h0IChDKSAyMDEyLTIwMTQgWXVzdWtlIFN1enVraSA8dXRhdGFuZS50ZWFAZ21haWwuY29tPlxuICBDb3B5cmlnaHQgKEMpIDIwMTMgQWxleCBTZXZpbGxlIDxoaUBhbGV4YW5kZXJzZXZpbGxlLmNvbT5cbiAgQ29weXJpZ2h0IChDKSAyMDE0IFRoaWFnbyBkZSBBcnJ1ZGEgPHRwYWRpbGhhODRAZ21haWwuY29tPlxuXG4gIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcblxuICAgICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAgICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG4gICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlXG4gICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuXG4gIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXG4gIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcbiAgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbiAgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIDxDT1BZUklHSFQgSE9MREVSPiBCRSBMSUFCTEUgRk9SIEFOWVxuICBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xuICAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG4gIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORFxuICBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuICAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0ZcbiAgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiovXG5cbi8qKlxuICogRXNjb3BlICg8YSBocmVmPVwiaHR0cDovL2dpdGh1Yi5jb20vZXN0b29scy9lc2NvcGVcIj5lc2NvcGU8L2E+KSBpcyBhbiA8YVxuICogaHJlZj1cImh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9wdWJsaWNhdGlvbnMvc3RhbmRhcmRzL0VjbWEtMjYyLmh0bVwiPkVDTUFTY3JpcHQ8L2E+XG4gKiBzY29wZSBhbmFseXplciBleHRyYWN0ZWQgZnJvbSB0aGUgPGFcbiAqIGhyZWY9XCJodHRwOi8vZ2l0aHViLmNvbS9lc3Rvb2xzL2VzbWFuZ2xlXCI+ZXNtYW5nbGUgcHJvamVjdDwvYS8+LlxuICogPHA+XG4gKiA8ZW0+ZXNjb3BlPC9lbT4gZmluZHMgbGV4aWNhbCBzY29wZXMgaW4gYSBzb3VyY2UgcHJvZ3JhbSwgaS5lLiBhcmVhcyBvZiB0aGF0XG4gKiBwcm9ncmFtIHdoZXJlIGRpZmZlcmVudCBvY2N1cnJlbmNlcyBvZiB0aGUgc2FtZSBpZGVudGlmaWVyIHJlZmVyIHRvIHRoZSBzYW1lXG4gKiB2YXJpYWJsZS4gV2l0aCBlYWNoIHNjb3BlIHRoZSBjb250YWluZWQgdmFyaWFibGVzIGFyZSBjb2xsZWN0ZWQsIGFuZCBlYWNoXG4gKiBpZGVudGlmaWVyIHJlZmVyZW5jZSBpbiBjb2RlIGlzIGxpbmtlZCB0byBpdHMgY29ycmVzcG9uZGluZyB2YXJpYWJsZSAoaWZcbiAqIHBvc3NpYmxlKS5cbiAqIDxwPlxuICogPGVtPmVzY29wZTwvZW0+IHdvcmtzIG9uIGEgc3ludGF4IHRyZWUgb2YgdGhlIHBhcnNlZCBzb3VyY2UgY29kZSB3aGljaCBoYXNcbiAqIHRvIGFkaGVyZSB0byB0aGUgPGFcbiAqIGhyZWY9XCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1NwaWRlck1vbmtleS9QYXJzZXJfQVBJXCI+XG4gKiBNb3ppbGxhIFBhcnNlciBBUEk8L2E+LiBFLmcuIDxhIGhyZWY9XCJodHRwOi8vZXNwcmltYS5vcmdcIj5lc3ByaW1hPC9hPiBpcyBhIHBhcnNlclxuICogdGhhdCBwcm9kdWNlcyBzdWNoIHN5bnRheCB0cmVlcy5cbiAqIDxwPlxuICogVGhlIG1haW4gaW50ZXJmYWNlIGlzIHRoZSB7QGxpbmsgYW5hbHl6ZX0gZnVuY3Rpb24uXG4gKiBAbW9kdWxlIGVzY29wZVxuICovXG5cbi8qanNsaW50IGJpdHdpc2U6dHJ1ZSAqL1xuXG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5cbmltcG9ydCBTY29wZU1hbmFnZXIgZnJvbSAnLi9zY29wZS1tYW5hZ2VyJztcbmltcG9ydCBSZWZlcmVuY2VyIGZyb20gJy4vcmVmZXJlbmNlcic7XG5pbXBvcnQgUmVmZXJlbmNlIGZyb20gJy4vcmVmZXJlbmNlJztcbmltcG9ydCBWYXJpYWJsZSBmcm9tICcuL3ZhcmlhYmxlJztcbmltcG9ydCBTY29wZSBmcm9tICcuL3Njb3BlJztcbmltcG9ydCB7IHZlcnNpb24gfSBmcm9tICcuLi9wYWNrYWdlLmpzb24nO1xuXG5mdW5jdGlvbiBkZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBvcHRpbWlzdGljOiBmYWxzZSxcbiAgICAgICAgZGlyZWN0aXZlOiBmYWxzZSxcbiAgICAgICAgbm9kZWpzU2NvcGU6IGZhbHNlLFxuICAgICAgICBpbXBsaWVkU3RyaWN0OiBmYWxzZSxcbiAgICAgICAgc291cmNlVHlwZTogJ3NjcmlwdCcsICAvLyBvbmUgb2YgWydzY3JpcHQnLCAnbW9kdWxlJ11cbiAgICAgICAgZWNtYVZlcnNpb246IDUsXG4gICAgICAgIGNoaWxkVmlzaXRvcktleXM6IG51bGwsXG4gICAgICAgIGZhbGxiYWNrOiAnaXRlcmF0aW9uJ1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURlZXBseSh0YXJnZXQsIG92ZXJyaWRlKSB7XG4gICAgdmFyIGtleSwgdmFsO1xuXG4gICAgZnVuY3Rpb24gaXNIYXNoT2JqZWN0KHRhcmdldCkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcgJiYgdGFyZ2V0IGluc3RhbmNlb2YgT2JqZWN0ICYmICEodGFyZ2V0IGluc3RhbmNlb2YgQXJyYXkpICYmICEodGFyZ2V0IGluc3RhbmNlb2YgUmVnRXhwKTtcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiBvdmVycmlkZSkge1xuICAgICAgICBpZiAob3ZlcnJpZGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgdmFsID0gb3ZlcnJpZGVba2V5XTtcbiAgICAgICAgICAgIGlmIChpc0hhc2hPYmplY3QodmFsKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0hhc2hPYmplY3QodGFyZ2V0W2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZURlZXBseSh0YXJnZXRba2V5XSwgdmFsKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHVwZGF0ZURlZXBseSh7fSwgdmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qKlxuICogTWFpbiBpbnRlcmZhY2UgZnVuY3Rpb24uIFRha2VzIGFuIEVzcHJpbWEgc3ludGF4IHRyZWUgYW5kIHJldHVybnMgdGhlXG4gKiBhbmFseXplZCBzY29wZXMuXG4gKiBAZnVuY3Rpb24gYW5hbHl6ZVxuICogQHBhcmFtIHtlc3ByaW1hLlRyZWV9IHRyZWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm92aWRlZE9wdGlvbnMgLSBPcHRpb25zIHRoYXQgdGFpbG9yIHRoZSBzY29wZSBhbmFseXNpc1xuICogQHBhcmFtIHtib29sZWFufSBbcHJvdmlkZWRPcHRpb25zLm9wdGltaXN0aWM9ZmFsc2VdIC0gdGhlIG9wdGltaXN0aWMgZmxhZ1xuICogQHBhcmFtIHtib29sZWFufSBbcHJvdmlkZWRPcHRpb25zLmRpcmVjdGl2ZT1mYWxzZV0tIHRoZSBkaXJlY3RpdmUgZmxhZ1xuICogQHBhcmFtIHtib29sZWFufSBbcHJvdmlkZWRPcHRpb25zLmlnbm9yZUV2YWw9ZmFsc2VdLSB3aGV0aGVyIHRvIGNoZWNrICdldmFsKCknIGNhbGxzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm92aWRlZE9wdGlvbnMubm9kZWpzU2NvcGU9ZmFsc2VdLSB3aGV0aGVyIHRoZSB3aG9sZVxuICogc2NyaXB0IGlzIGV4ZWN1dGVkIHVuZGVyIG5vZGUuanMgZW52aXJvbm1lbnQuIFdoZW4gZW5hYmxlZCwgZXNjb3BlIGFkZHNcbiAqIGEgZnVuY3Rpb24gc2NvcGUgaW1tZWRpYXRlbHkgZm9sbG93aW5nIHRoZSBnbG9iYWwgc2NvcGUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcm92aWRlZE9wdGlvbnMuaW1wbGllZFN0cmljdD1mYWxzZV0tIGltcGxpZWQgc3RyaWN0IG1vZGVcbiAqIChpZiBlY21hVmVyc2lvbiA+PSA1KS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbcHJvdmlkZWRPcHRpb25zLnNvdXJjZVR5cGU9J3NjcmlwdCddLSB0aGUgc291cmNlIHR5cGUgb2YgdGhlIHNjcmlwdC4gb25lIG9mICdzY3JpcHQnIGFuZCAnbW9kdWxlJ1xuICogQHBhcmFtIHtudW1iZXJ9IFtwcm92aWRlZE9wdGlvbnMuZWNtYVZlcnNpb249NV0tIHdoaWNoIEVDTUFTY3JpcHQgdmVyc2lvbiBpcyBjb25zaWRlcmVkXG4gKiBAcGFyYW0ge09iamVjdH0gW3Byb3ZpZGVkT3B0aW9ucy5jaGlsZFZpc2l0b3JLZXlzPW51bGxdIC0gQWRkaXRpb25hbCBrbm93biB2aXNpdG9yIGtleXMuIFNlZSBbZXNyZWN1cnNlXShodHRwczovL2dpdGh1Yi5jb20vZXN0b29scy9lc3JlY3Vyc2UpJ3MgdGhlIGBjaGlsZFZpc2l0b3JLZXlzYCBvcHRpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gW3Byb3ZpZGVkT3B0aW9ucy5mYWxsYmFjaz0naXRlcmF0aW9uJ10gLSBBIGtpbmQgb2YgdGhlIGZhbGxiYWNrIGluIG9yZGVyIHRvIGVuY291bnRlciB3aXRoIHVua25vd24gbm9kZS4gU2VlIFtlc3JlY3Vyc2VdKGh0dHBzOi8vZ2l0aHViLmNvbS9lc3Rvb2xzL2VzcmVjdXJzZSkncyB0aGUgYGZhbGxiYWNrYCBvcHRpb24uXG4gKiBAcmV0dXJuIHtTY29wZU1hbmFnZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbmFseXplKHRyZWUsIHByb3ZpZGVkT3B0aW9ucykge1xuICAgIHZhciBzY29wZU1hbmFnZXIsIHJlZmVyZW5jZXIsIG9wdGlvbnM7XG5cbiAgICBvcHRpb25zID0gdXBkYXRlRGVlcGx5KGRlZmF1bHRPcHRpb25zKCksIHByb3ZpZGVkT3B0aW9ucyk7XG5cbiAgICBzY29wZU1hbmFnZXIgPSBuZXcgU2NvcGVNYW5hZ2VyKG9wdGlvbnMpO1xuXG4gICAgcmVmZXJlbmNlciA9IG5ldyBSZWZlcmVuY2VyKG9wdGlvbnMsIHNjb3BlTWFuYWdlcik7XG4gICAgcmVmZXJlbmNlci52aXNpdCh0cmVlKTtcblxuICAgIGFzc2VydChzY29wZU1hbmFnZXIuX19jdXJyZW50U2NvcGUgPT09IG51bGwsICdjdXJyZW50U2NvcGUgc2hvdWxkIGJlIG51bGwuJyk7XG5cbiAgICByZXR1cm4gc2NvcGVNYW5hZ2VyO1xufVxuXG5leHBvcnQge1xuICAgIC8qKiBAbmFtZSBtb2R1bGU6ZXNjb3BlLnZlcnNpb24gKi9cbiAgICB2ZXJzaW9uLFxuICAgIC8qKiBAbmFtZSBtb2R1bGU6ZXNjb3BlLlJlZmVyZW5jZSAqL1xuICAgIFJlZmVyZW5jZSxcbiAgICAvKiogQG5hbWUgbW9kdWxlOmVzY29wZS5WYXJpYWJsZSAqL1xuICAgIFZhcmlhYmxlLFxuICAgIC8qKiBAbmFtZSBtb2R1bGU6ZXNjb3BlLlNjb3BlICovXG4gICAgU2NvcGUsXG4gICAgLyoqIEBuYW1lIG1vZHVsZTplc2NvcGUuU2NvcGVNYW5hZ2VyICovXG4gICAgU2NvcGVNYW5hZ2VyXG59O1xuXG5cbi8qIHZpbTogc2V0IHN3PTQgdHM9NCBldCB0dz04MCA6ICovXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
