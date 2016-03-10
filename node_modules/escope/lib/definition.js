'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Definition = exports.ParameterDefinition = undefined;

var _variable = require('./variable');

var _variable2 = _interopRequireDefault(_variable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /*
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

/**
 * @class Definition
 */

var Definition = function Definition(type, name, node, parent, index, kind) {
  _classCallCheck(this, Definition);

  /**
   * @member {String} Definition#type - type of the occurrence (e.g. "Parameter", "Variable", ...).
   */
  this.type = type;
  /**
   * @member {esprima.Identifier} Definition#name - the identifier AST node of the occurrence.
   */
  this.name = name;
  /**
   * @member {esprima.Node} Definition#node - the enclosing node of the identifier.
   */
  this.node = node;
  /**
   * @member {esprima.Node?} Definition#parent - the enclosing statement node of the identifier.
   */
  this.parent = parent;
  /**
   * @member {Number?} Definition#index - the index in the declaration statement.
   */
  this.index = index;
  /**
   * @member {String?} Definition#kind - the kind of the declaration statement.
   */
  this.kind = kind;
};

/**
 * @class ParameterDefinition
 */


exports.default = Definition;

var ParameterDefinition = function (_Definition) {
  _inherits(ParameterDefinition, _Definition);

  function ParameterDefinition(name, node, index, rest) {
    _classCallCheck(this, ParameterDefinition);

    /**
     * Whether the parameter definition is a part of a rest parameter.
     * @member {boolean} ParameterDefinition#rest
     */

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ParameterDefinition).call(this, _variable2.default.Parameter, name, node, null, index, null));

    _this.rest = rest;
    return _this;
  }

  return ParameterDefinition;
}(Definition);

exports.ParameterDefinition = ParameterDefinition;
exports.Definition = Definition;

/* vim: set sw=4 ts=4 et tw=80 : */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmluaXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNkJxQixhQUNqQixTQURpQixVQUNqQixDQUFZLElBQVosRUFBa0IsSUFBbEIsRUFBd0IsSUFBeEIsRUFBOEIsTUFBOUIsRUFBc0MsS0FBdEMsRUFBNkMsSUFBN0MsRUFBbUQ7d0JBRGxDLFlBQ2tDOzs7OztBQUkvQyxPQUFLLElBQUwsR0FBWSxJQUFaOzs7O0FBSitDLE1BUS9DLENBQUssSUFBTCxHQUFZLElBQVo7Ozs7QUFSK0MsTUFZL0MsQ0FBSyxJQUFMLEdBQVksSUFBWjs7OztBQVorQyxNQWdCL0MsQ0FBSyxNQUFMLEdBQWMsTUFBZDs7OztBQWhCK0MsTUFvQi9DLENBQUssS0FBTCxHQUFhLEtBQWI7Ozs7QUFwQitDLE1Bd0IvQyxDQUFLLElBQUwsR0FBWSxJQUFaLENBeEIrQztDQUFuRDs7Ozs7OztrQkFEaUI7O0lBZ0NmOzs7QUFDRixXQURFLG1CQUNGLENBQVksSUFBWixFQUFrQixJQUFsQixFQUF3QixLQUF4QixFQUErQixJQUEvQixFQUFxQzswQkFEbkMscUJBQ21DOzs7Ozs7O3VFQURuQyxnQ0FFUSxtQkFBUyxTQUFULEVBQW9CLE1BQU0sTUFBTSxNQUFNLE9BQU8sT0FEbEI7O0FBTWpDLFVBQUssSUFBTCxHQUFZLElBQVosQ0FOaUM7O0dBQXJDOztTQURFO0VBQTRCOztRQVk5QjtRQUNBIiwiZmlsZSI6ImRlZmluaXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICBDb3B5cmlnaHQgKEMpIDIwMTUgWXVzdWtlIFN1enVraSA8dXRhdGFuZS50ZWFAZ21haWwuY29tPlxuXG4gIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcblxuICAgICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAgICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG4gICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlXG4gICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuXG4gIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXG4gIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEVcbiAgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbiAgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIDxDT1BZUklHSFQgSE9MREVSPiBCRSBMSUFCTEUgRk9SIEFOWVxuICBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xuICAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG4gIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORFxuICBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuICAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0ZcbiAgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiovXG5cbmltcG9ydCBWYXJpYWJsZSBmcm9tICcuL3ZhcmlhYmxlJztcblxuLyoqXG4gKiBAY2xhc3MgRGVmaW5pdGlvblxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWZpbml0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBuYW1lLCBub2RlLCBwYXJlbnQsIGluZGV4LCBraW5kKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtTdHJpbmd9IERlZmluaXRpb24jdHlwZSAtIHR5cGUgb2YgdGhlIG9jY3VycmVuY2UgKGUuZy4gXCJQYXJhbWV0ZXJcIiwgXCJWYXJpYWJsZVwiLCAuLi4pLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge2VzcHJpbWEuSWRlbnRpZmllcn0gRGVmaW5pdGlvbiNuYW1lIC0gdGhlIGlkZW50aWZpZXIgQVNUIG5vZGUgb2YgdGhlIG9jY3VycmVuY2UuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7ZXNwcmltYS5Ob2RlfSBEZWZpbml0aW9uI25vZGUgLSB0aGUgZW5jbG9zaW5nIG5vZGUgb2YgdGhlIGlkZW50aWZpZXIuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm5vZGUgPSBub2RlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7ZXNwcmltYS5Ob2RlP30gRGVmaW5pdGlvbiNwYXJlbnQgLSB0aGUgZW5jbG9zaW5nIHN0YXRlbWVudCBub2RlIG9mIHRoZSBpZGVudGlmaWVyLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtOdW1iZXI/fSBEZWZpbml0aW9uI2luZGV4IC0gdGhlIGluZGV4IGluIHRoZSBkZWNsYXJhdGlvbiBzdGF0ZW1lbnQuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtTdHJpbmc/fSBEZWZpbml0aW9uI2tpbmQgLSB0aGUga2luZCBvZiB0aGUgZGVjbGFyYXRpb24gc3RhdGVtZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5raW5kID0ga2luZDtcbiAgICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFBhcmFtZXRlckRlZmluaXRpb25cbiAqL1xuY2xhc3MgUGFyYW1ldGVyRGVmaW5pdGlvbiBleHRlbmRzIERlZmluaXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIG5vZGUsIGluZGV4LCByZXN0KSB7XG4gICAgICAgIHN1cGVyKFZhcmlhYmxlLlBhcmFtZXRlciwgbmFtZSwgbm9kZSwgbnVsbCwgaW5kZXgsIG51bGwpO1xuICAgICAgICAvKipcbiAgICAgICAgICogV2hldGhlciB0aGUgcGFyYW1ldGVyIGRlZmluaXRpb24gaXMgYSBwYXJ0IG9mIGEgcmVzdCBwYXJhbWV0ZXIuXG4gICAgICAgICAqIEBtZW1iZXIge2Jvb2xlYW59IFBhcmFtZXRlckRlZmluaXRpb24jcmVzdFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZXN0ID0gcmVzdDtcbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgUGFyYW1ldGVyRGVmaW5pdGlvbixcbiAgICBEZWZpbml0aW9uXG59XG5cbi8qIHZpbTogc2V0IHN3PTQgdHM9NCBldCB0dz04MCA6ICovXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
