'use strict';

exports.name = 'nue';
exports.version = '0.7.1';
exports.flow = flow;
exports.parallel = parallel;
exports.as = as;

var util = require('util');
var assert = require('assert');
var debugMode = process.env.NODE_DEBUG && /\bnue\b/.test(process.env.NODE_DEBUG);
var flowId = 0;

function flow() {
  if (arguments.length === 1 && typeof arguments[0] === 'string') {
    var flowName = arguments[0];
    return function () {
      return deferFlow(flowName, normalizeArgs(arguments));
    };
  } else {
    return deferFlow('', normalizeArgs(arguments));
  }

  function deferFlow(flowName, functions) {
    function startFlow() {
      var flow = {
        flowName: flowName,
        flowId: flowId++,
        context: this,
        isTopLevel: !(this instanceof StepContext),
        data: {},
        err: null
      };
      var steps = functions.length > 0 ? functions : [function () { this.next(); }];
      if (debugMode && flow.isTopLevel) {
        var location = getLocation(startFlow);
        debug('begin TOP_LEVEL_FLOW. flow: %s(%d), calledAt: %s:%d:%d, args:',
          flow.flowName || '<anonymous>', flow.flowId,
          location.fileName, location.lineNumber, location.columnNumber,
          Array.prototype.slice.call(arguments));
      }
      var head = chainSteps(flow, steps);
      head.apply(this, arguments);
    }
    startFlow.stepName = flowName;
    return startFlow;
  }

  function chainSteps(flow, steps) {
    var len = steps.length;
    var lastIndex = len - 1;
    var last = makeLastStep(steps[lastIndex], lastIndex);
    var isThrown = false;
    if (len === 1) {
      return last;
    }

    return steps.reduceRight(function chain(prev, curr, index) {
      assert.equal(typeof curr, 'function', 'Each argument for `flow` must be a function.');
      return function step() {
        var next = index === len - 2 ? last : prev;
        var context = new StepContext(flow, curr.stepName || curr.name, index, next, last);
        try {
          runStep(curr, context, arguments);
        } catch (e) {
          if (isThrown) {
            throw e;
          }
          StepContext.prototype.endWith.call(context, e);
        }
      };
    });

    function makeLastStep(fn, index) {
      assert.equal(typeof fn, 'function', 'Each argument for `flow` must be a function.');
      return function lastStep() {
        var context = new StepContext(flow, fn.stepName || fn.name, index, exit, exit);
        try {
          runStep(fn, context, arguments, true);
        } catch (e) {
          isThrown = true;
          throw e;
        }
      };

      function exit() {
        if (flow.isTopLevel) {
          if (flow.err) {
            var message = 'An error must be handled in a last step of its flow. ' +
              'To indicate error handling completed, set null to `this.err` before exiting the last step. ' +
              'cause: ' + util.inspect(flow.err);
            var err = new Error(message);
            err.name = 'NueUnhandledError';
            throw err;
          }
        } else {
          if (flow.err) {
            flow.context.endWith.call(flow.context, flow.err);
          } else {
            flow.context.next.apply(flow.context, arguments);
          }
        }
      }
    }

    function runStep(step, context, args) {
      if (debugMode) {
        debug('begin STEP. flow: %s(%d), step: %s(%d), args:',
          context.flowName || '<anonymous>', context._flow.flowId,
          context.stepName || '<anonymous>', context.stepIndex, Array.prototype.slice.call(args));
      }
      try {
        step.apply(context, args);
      } catch (e) {
        if (debugMode) {
          debug('error STEP. flow: , step: %s(%d), err:',
            context.flowName || '<anonymous>', context._flow.flowId,
            context.stepName || '<anonymous>', context.stepIndex, e);
        }
        throw e;
      }
    }
  }
}

function parallel() {
  if (arguments.length === 1 && typeof arguments[0] === 'string') {
    var flowName = arguments[0];
    return function () {
      return deferParallel(flowName, normalizeArgs(arguments));
    };
  } else {
    return deferParallel('', normalizeArgs(arguments));
  }

  function deferParallel(flowName, functions) {
    function startParallel() {
      assert(this instanceof StepContext, 'A `parallel` must be inside a flow or another parallel.');
      var self = this;
      var args = Array.prototype.slice.call(arguments);
      self.asyncEach(1)(functions, function (fn, group) {
        assert.equal(typeof fn, 'function', 'Each argument for `parallel` must be a function.');
        var callback = group.async(As.ALL);
        var end = function end() {
          if (this.err) {
            self.endWith(this.err);
          } else {
            callback.apply(null, arguments);
          }
        };
        end.stepName = (fn.stepName || fn.name) + '_end';
        flow(flowName)(fn, end).apply(self, args);
      });
    }
    startParallel.stepName = flowName;
    return startParallel;
  }
}

function as(index) {
  return new As(index);
}

function normalizeArgs(args) {
  return (args.length === 1 && Array.isArray(args[0])) ? args[0] : Array.prototype.slice.call(args);
}

function getLocation(target) {
  var originalPrepareStackTrace = Error.prepareStackTrace;
  var originalStackTraceLimit = Error.stackTraceLimit;
  Error.prepareStackTrace = prepareStackTrace;
  Error.stackTraceLimit = 1;
  var err = {};
  Error.captureStackTrace(err, target);
  var stack = err.stack;
  Error.prepareStackTrace = originalPrepareStackTrace;
  Error.stackTraceLimit = originalStackTraceLimit;
  return {
    functionName: stack ? stack.getFunctionName() : '',
    fileName: stack ? stack.getFileName() : '',
    lineNumber: stack ? stack.getLineNumber() : -1,
    columnNumber: stack ? stack.getColumnNumber() : -1
  };

  function prepareStackTrace() {
    return arguments[1][0];
  }
}

function debug() {
  var args = Array.prototype.slice.call(arguments);
  args[0] = 'NUE: ' + args[0];
  console.error.apply(console, args);
}

function As(index) {
  this.index = index;
}

As.ALL = {description: 'all'};

As.TAIL = {description: 'tail'};

function StepContext(flow, name, index, next, last) {
  this._flow = flow;
  this._next = next;
  this._last = last;
  this._async = new Async(false, this.next.bind(this), this.endWith.bind(this));
  this.err = flow.err;
  this.data = flow.data;
  this.flowName = flow.flowName;
  this.stepName = name;
  this.stepIndex = index;
}

StepContext.DEFAULT_CONCURRENCY = 10;

StepContext.noop = function noop() {};

StepContext.prototype._disable = function _disable() {
  this.next = StepContext.noop;
  this.end = StepContext.noop;
  this.endWith = StepContext.noop;
};

StepContext.prototype.next = function next() {
  this._disable();
  this._flow.err = this.err;
  this._next.apply(null, arguments);
};

StepContext.prototype.end = function end() {
  this._disable();
  this._flow.err = this.err;
  this._last.apply(null, arguments);
};

StepContext.prototype.endWith = function endWith(err) {
  this._disable();
  this._flow.err = err;
  this._last.call(null);
};

StepContext.prototype._adjustMapping = function _adjustMapping(mapping) {
  switch (mapping.length) {
    case 0: return As.TAIL;
    case 1: return mapping[0];
    default: return mapping
  }
};

StepContext.prototype.async = function async(mapping) {
  mapping = this._adjustMapping(Array.prototype.slice.call(arguments));
  return this._async.makeCallback.call(this._async, mapping, async);
};

StepContext.prototype.asyncEach = function asyncEach() {
  var self = this;
  var callback = self.async(As.ALL);
  var asyncObj = new Async(true, callback.bind(self), self.endWith.bind(self));
  var group = {
    async: function async(mapping) {
      mapping = self._adjustMapping(Array.prototype.slice.call(arguments));
      return asyncObj.makeCallback.call(asyncObj, mapping, async);
    }
  };

  if (arguments.length === 1 && typeof arguments[0] === 'number') {
    var concurrency = arguments[0];
    return function () {
      validateAndStart(concurrency, arguments[0], arguments[1]);
    };
  } else {
    validateAndStart(StepContext.DEFAULT_CONCURRENCY, arguments[0], arguments[1]);
  }

  function validateAndStart(concurrency, array, worker) {
    assert(Array.isArray(array), 'An argument `array` must be an array.');
    assert.equal(typeof worker, 'function', 'An argument `worker` must be a function.');
    process.nextTick(function startEach() {
      each(concurrency, array, worker, 0);
    });
  }

  function each(concurrency, array, worker, index) {
    var len = array.length;
    for (var i = 0; i < concurrency && index < len; i++, index++) {
      worker.call(self, array[index], group, index, array);
    }
    if (index === len) {
      process.nextTick(asyncObj.makeCallback(Async.SIGNAL_UNLOCK));
    } else {
      process.nextTick(function nextEach() {
        each(concurrency, array, worker, index);
      });
    }
  }
};

StepContext.prototype.exec = function exec(fn) {
  assert(arguments.length > 1, 'Arguments length must be more than 1.');
  assert.equal(typeof fn, 'function', 'The first argument must be a function.');
  assert.equal(typeof arguments[arguments.length - 1], 'function', 'The last argument must be a function.');
  var self = this;
  var callback = arguments[arguments.length - 1];
  var args = Array.prototype.slice.call(arguments, 1, arguments.length - 1);
  var end = function end() {
    callback.apply(null, [this.err].concat(Array.prototype.slice.call(arguments)));
  };
  end.stepName = (fn.stepName || fn.name) + '_end';
  process.nextTick(function execFlow() {
    flow('exec')(fn, end).apply(self, args);
  });
};

function Async(lock, next, endWith) {
  this.lock = lock;
  this.next = next;
  this.endWith = endWith;
  this.index = 0;
  this.pending = 0;
  this.isCanceled = false;
  this.results = [];
}

Async.SIGNAL_UNLOCK = {description: 'signal_unlock'};

Async.prototype.makeCallback = function makeCallback(mapping, caller) {
  this.pending++;
  if (this.index === 0 && !this.lock) {
    this.lock = true;
    process.nextTick(this.makeCallback(Async.SIGNAL_UNLOCK));
  }
  var index = mapping === Async.SIGNAL_UNLOCK ? -1 : this.index++;
  var location = getLocation(caller);
  var self = this;

  return function asyncCallback(err) {
    self.pending--;
    if (!self.isCanceled) {
      if (err && isErrorHandleRequired(mapping)) {
        self.isCanceled = true;
        self.endWith.call(null, makeAsyncError(err));
      } else {
        if (mapping === Async.SIGNAL_UNLOCK) {
          self.lock = false;
        } else {
          self.results[index] = mapArguments(mapping, arguments);
        }
        if (self.pending === 0 && !self.lock) {
          self.next.apply(null, self.results);
        }
      }
    }
  };

  function isErrorHandleRequired(mapping) {
    if (mapping === Async.SIGNAL_UNLOCK || mapping === As.ALL) {
      return false;
    }
    if (mapping === As.TAIL) {
      return true;
    }
    if (mapping instanceof As) {
      return mapping.index !== 0;
    }
    if (mapping == null) {
      return true;
    }
    return Object.keys(mapping).every(function (key) {
      var value = mapping[key];
      if (value instanceof As) {
        return value.index !== 0;
      }
      return true;
    });
  }

  function mapArguments(mapping, args) {
    if (mapping === As.ALL) {
      return Array.prototype.slice.call(args);
    }
    if (mapping === As.TAIL) {
      return Array.prototype.slice.call(args, 1);
    }
    if (mapping instanceof As) {
      return args[mapping.index];
    }
    if (mapping == null) {
      return mapping;
    }
    return Object.keys(mapping).reduce(function (result, key) {
      var value = mapping[key];
      if (value instanceof As) {
        result[key] = args[value.index];
      } else {
        result[key] = value;
      }
      return result;
    }, {});
  }

  function makeAsyncError(err) {
    var log = {
      'function': location.functionName,
      location: util.format('%s:%d:%d', location.fileName, location.lineNumber, location.columnNumber),
      mapping: mapping
    };
    var cause;
    var history;
    if (err.name === 'NueAsyncError') {
      cause = err.cause;
      history = err.asyncCallHistory.concat([log]);
    } else {
      cause = err;
      history = [log];
    }
    var e = new Error('An error occurred in an async call.');
    e.name = 'NueAsyncError';
    e.cause = cause;
    e.asyncCallHistory = history;
    e.message += util.format('\ncause stack is ...\n  %s\nasync call history is ...\n',
      e.cause.stack, history);
    return e;
  }
};
