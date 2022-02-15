'use strict';

/**
 * Module dependencies.
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Pending = require('./pending');
var utils = require('./utils');
var inherits = utils.inherits;
var debug = require('debug')('mocha:runner');
var Runnable = require('./runnable');
var Suite = require('./suite');
var HOOK_TYPE_BEFORE_EACH = Suite.constants.HOOK_TYPE_BEFORE_EACH;
var HOOK_TYPE_AFTER_EACH = Suite.constants.HOOK_TYPE_AFTER_EACH;
var HOOK_TYPE_AFTER_ALL = Suite.constants.HOOK_TYPE_AFTER_ALL;
var HOOK_TYPE_BEFORE_ALL = Suite.constants.HOOK_TYPE_BEFORE_ALL;
var EVENT_ROOT_SUITE_RUN = Suite.constants.EVENT_ROOT_SUITE_RUN;
var STATE_FAILED = Runnable.constants.STATE_FAILED;
var STATE_PASSED = Runnable.constants.STATE_PASSED;
var dQuote = utils.dQuote;
var sQuote = utils.sQuote;
var stackFilter = utils.stackTraceFilter();
var stringify = utils.stringify;
var type = utils.type;
var errors = require('./errors');
var createInvalidExceptionError = errors.createInvalidExceptionError;
var createUnsupportedError = errors.createUnsupportedError;
var createFatalError = errors.createFatalError;

/**
 * Non-enumerable globals.
 * @readonly
 */
var globals = [
  'setTimeout',
  'clearTimeout',
  'setInterval',
  'clearInterval',
  'XMLHttpRequest',
  'Date',
  'setImmediate',
  'clearImmediate'
];

var constants = utils.defineConstants(
  /**
   * {@link Runner}-related constants.
   * @public
   * @memberof Runner
   * @readonly
   * @alias constants
   * @static
   * @enum {string}
   */
  {
    /**
     * Emitted when {@link Hook} execution begins
     */
    EVENT_HOOK_BEGIN: 'hook',
    /**
     * Emitted when {@link Hook} execution ends
     */
    EVENT_HOOK_END: 'hook end',
    /**
     * Emitted when Root {@link Suite} execution begins (all files have been parsed and hooks/tests are ready for execution)
     */
    EVENT_RUN_BEGIN: 'start',
    /**
     * Emitted when Root {@link Suite} execution has been delayed via `delay` option
     */
    EVENT_DELAY_BEGIN: 'waiting',
    /**
     * Emitted when delayed Root {@link Suite} execution is triggered by user via `global.run()`
     */
    EVENT_DELAY_END: 'ready',
    /**
     * Emitted when Root {@link Suite} execution ends
     */
    EVENT_RUN_END: 'end',
    /**
     * Emitted when {@link Suite} execution begins
     */
    EVENT_SUITE_BEGIN: 'suite',
    /**
     * Emitted when {@link Suite} execution ends
     */
    EVENT_SUITE_END: 'suite end',
    /**
     * Emitted when {@link Test} execution begins
     */
    EVENT_TEST_BEGIN: 'test',
    /**
     * Emitted when {@link Test} execution ends
     */
    EVENT_TEST_END: 'test end',
    /**
     * Emitted when {@link Test} execution fails
     */
    EVENT_TEST_FAIL: 'fail',
    /**
     * Emitted when {@link Test} execution succeeds
     */
    EVENT_TEST_PASS: 'pass',
    /**
     * Emitted when {@link Test} becomes pending
     */
    EVENT_TEST_PENDING: 'pending',
    /**
     * Emitted when {@link Test} execution has failed, but will retry
     */
    EVENT_TEST_RETRY: 'retry',
    /**
     * Initial state of Runner
     */
    STATE_IDLE: 'idle',
    /**
     * State set to this value when the Runner has started running
     */
    STATE_RUNNING: 'running',
    /**
     * State set to this value when the Runner has stopped
     */
    STATE_STOPPED: 'stopped'
  }
);

module.exports = Runner;

/**
 * Initialize a `Runner` at the Root {@link Suite}, which represents a hierarchy of {@link Suite|Suites} and {@link Test|Tests}.
 *
 * @extends external:EventEmitter
 * @public
 * @class
 * @param {Suite} suite - Root suite
 * @param {Object|boolean} [opts] - Options. If `boolean`, whether or not to delay execution of root suite until ready (for backwards compatibility).
 * @param {boolean} [opts.delay] - Whether to delay execution of root suite until ready.
 * @param {boolean} [opts.cleanReferencesAfterRun] - Whether to clean references to test fns and hooks when a suite is done.
 */
function Runner(suite, opts) {
  if (opts === undefined) {
    opts = {};
  }
  if (typeof opts === 'boolean') {
    this._delay = opts;
    opts = {};
  } else {
    this._delay = opts.delay;
  }
  var self = this;
  this._globals = [];
  this._abort = false;
  this.suite = suite;
  this._opts = opts;
  this.state = constants.STATE_IDLE;
  this.total = suite.total();
  this.failures = 0;
  this._eventListeners = [];
  this.on(constants.EVENT_TEST_END, function(test) {
    if (test.type === 'test' && test.retriedTest() && test.parent) {
      var idx =
        test.parent.tests && test.parent.tests.indexOf(test.retriedTest());
      if (idx > -1) test.parent.tests[idx] = test;
    }
    self.checkGlobals(test);
  });
  this.on(constants.EVENT_HOOK_END, function(hook) {
    self.checkGlobals(hook);
  });
  this._defaultGrep = /.*/;
  this.grep(this._defaultGrep);
  this.globals(this.globalProps());

  this.uncaught = this._uncaught.bind(this);
}

/**
 * Wrapper for setImmediate, process.nextTick, or browser polyfill.
 *
 * @param {Function} fn
 * @private
 */
Runner.immediately = global.setImmediate || process.nextTick;

/**
 * Inherit from `EventEmitter.prototype`.
 */
inherits(Runner, EventEmitter);

/**
 * Replacement for `target.on(eventName, listener)` that does bookkeeping to remove them when this runner instance is disposed.
 * @param {EventEmitter} target - The `EventEmitter`
 * @param {string} eventName - The event name
 * @param {string} fn - Listener function
 */
Runner.prototype._addEventListener = function(target, eventName, listener) {
  target.on(eventName, listener);
  this._eventListeners.push([target, eventName, listener]);
};

/**
 * Replacement for `target.removeListener(eventName, listener)` that also updates the bookkeeping.
 * @param {EventEmitter} target - The `EventEmitter`
 * @param {string} eventName - The event anme
 * @param {function} listener - Listener function
 */
Runner.prototype._removeEventListener = function(target, eventName, listener) {
  var eventListenerIndex = -1;
  for (var i = 0; i < this._eventListeners.length; i++) {
    var eventListenerDescriptor = this._eventListeners[i];
    if (
      eventListenerDescriptor[0] === target &&
      eventListenerDescriptor[1] === eventName &&
      eventListenerDescriptor[2] === listener
    ) {
      eventListenerIndex = i;
      break;
    }
  }
  if (eventListenerIndex !== -1) {
    var removedListener = this._eventListeners.splice(eventListenerIndex, 1)[0];
    removedListener[0].removeListener(removedListener[1], removedListener[2]);
  }
};

/**
 * Removes all event handlers set during a run on this instance.
 * Remark: this does _not_ clean/dispose the tests or suites themselves.
 */
Runner.prototype.dispose = function() {
  this.removeAllListeners();
  this._eventListeners.forEach(function(eventListenerDescriptor) {
    eventListenerDescriptor[0].removeListener(
      eventListenerDescriptor[1],
      eventListenerDescriptor[2]
    );
  });
};

/**
 * Run tests with full titles matching `re`. Updates runner.total
 * with number of tests matched.
 *
 * @public
 * @memberof Runner
 * @param {RegExp} re
 * @param {boolean} invert
 * @return {Runner} Runner instance.
 */
Runner.prototype.grep = function(re, invert) {
  debug('grep(): setting to %s', re);
  this._grep = re;
  this._invert = invert;
  this.total = this.grepTotal(this.suite);
  return this;
};

/**
 * Returns the number of tests matching the grep search for the
 * given suite.
 *
 * @memberof Runner
 * @public
 * @param {Suite} suite
 * @return {number}
 */
Runner.prototype.grepTotal = function(suite) {
  var self = this;
  var total = 0;

  suite.eachTest(function(test) {
    var match = self._grep.test(test.fullTitle());
    if (self._invert) {
      match = !match;
    }
    if (match) {
      total++;
    }
  });

  return total;
};

/**
 * Return a list of global properties.
 *
 * @return {Array}
 * @private
 */
Runner.prototype.globalProps = function() {
  var props = Object.keys(global);

  // non-enumerables
  for (var i = 0; i < globals.length; ++i) {
    if (~props.indexOf(globals[i])) {
      continue;
    }
    props.push(globals[i]);
  }

  return props;
};

/**
 * Allow the given `arr` of globals.
 *
 * @public
 * @memberof Runner
 * @param {Array} arr
 * @return {Runner} Runner instance.
 */
Runner.prototype.globals = function(arr) {
  if (!arguments.length) {
    return this._globals;
  }
  debug('globals(): setting to %O', arr);
  this._globals = this._globals.concat(arr);
  return this;
};

/**
 * Check for global variable leaks.
 *
 * @private
 */
Runner.prototype.checkGlobals = function(test) {
  if (!this.checkLeaks) {
    return;
  }
  var ok = this._globals;

  var globals = this.globalProps();
  var leaks;

  if (test) {
    ok = ok.concat(test._allowedGlobals || []);
  }

  if (this.prevGlobalsLength === globals.length) {
    return;
  }
  this.prevGlobalsLength = globals.length;

  leaks = filterLeaks(ok, globals);
  this._globals = this._globals.concat(leaks);

  if (leaks.length) {
    var msg = 'global leak(s) detected: %s';
    var error = new Error(util.format(msg, leaks.map(sQuote).join(', ')));
    this.fail(test, error);
  }
};

/**
 * Fail the given `test`.
 *
 * @private
 * @param {Test} test
 * @param {Error} err
 */
Runner.prototype.fail = function(test, err) {
  if (test.isPending()) {
    return;
  }
  if (this.state === constants.STATE_STOPPED) {
    if (err.code === errors.constants.MULTIPLE_DONE) {
      throw err;
    }
    throw createFatalError(
      'Test failed after root suite execution completed!',
      err
    );
  }

  ++this.failures;
  debug('total number of failures: %d', this.failures);
  test.state = STATE_FAILED;

  if (!isError(err)) {
    err = thrown2Error(err);
  }

  try {
    err.stack =
      this.fullStackTrace || !err.stack ? err.stack : stackFilter(err.stack);
  } catch (ignore) {
    // some environments do not take kindly to monkeying with the stack
  }

  this.emit(constants.EVENT_TEST_FAIL, test, err);
};

/**
 * Fail the given `hook` with `err`.
 *
 * Hook failures work in the following pattern:
 * - If bail, run corresponding `after each` and `after` hooks,
 *   then exit
 * - Failed `before` hook skips all tests in a suite and subsuites,
 *   but jumps to corresponding `after` hook
 * - Failed `before each` hook skips remaining tests in a
 *   suite and jumps to corresponding `after each` hook,
 *   which is run only once
 * - Failed `after` hook does not alter execution order
 * - Failed `after each` hook skips remaining tests in a
 *   suite and subsuites, but executes other `after each`
 *   hooks
 *
 * @private
 * @param {Hook} hook
 * @param {Error} err
 */
Runner.prototype.failHook = function(hook, err) {
  hook.originalTitle = hook.originalTitle || hook.title;
  if (hook.ctx && hook.ctx.currentTest) {
    hook.title =
      hook.originalTitle + ' for ' + dQuote(hook.ctx.currentTest.title);
  } else {
    var parentTitle;
    if (hook.parent.title) {
      parentTitle = hook.parent.title;
    } else {
      parentTitle = hook.parent.root ? '{root}' : '';
    }
    hook.title = hook.originalTitle + ' in ' + dQuote(parentTitle);
  }

  this.fail(hook, err);
};

/**
 * Run hook `name` callbacks and then invoke `fn()`.
 *
 * @private
 * @param {string} name
 * @param {Function} fn
 */

Runner.prototype.hook = function(name, fn) {
  var suite = this.suite;
  var hooks = suite.getHooks(name);
  var self = this;

  function next(i) {
    var hook = hooks[i];
    if (!hook) {
      return fn();
    }
    self.currentRunnable = hook;

    if (name === HOOK_TYPE_BEFORE_ALL) {
      hook.ctx.currentTest = hook.parent.tests[0];
    } else if (name === HOOK_TYPE_AFTER_ALL) {
      hook.ctx.currentTest = hook.parent.tests[hook.parent.tests.length - 1];
    } else {
      hook.ctx.currentTest = self.test;
    }

    hook.allowUncaught = self.allowUncaught;

    self.emit(constants.EVENT_HOOK_BEGIN, hook);

    if (!hook.listeners('error').length) {
      self._addEventListener(hook, 'error', function(err) {
        self.failHook(hook, err);
      });
    }

    hook.run(function(err) {
      var testError = hook.error();
      if (testError) {
        self.fail(self.test, testError);
      }
      // conditional skip
      if (hook.pending) {
        if (name === HOOK_TYPE_AFTER_EACH) {
          // TODO define and implement use case
          if (self.test) {
            self.test.pending = true;
          }
        } else if (name === HOOK_TYPE_BEFORE_EACH) {
          if (self.test) {
            self.test.pending = true;
          }
          self.emit(constants.EVENT_HOOK_END, hook);
          hook.pending = false; // activates hook for next test
          return fn(new Error('abort hookDown'));
        } else if (name === HOOK_TYPE_BEFORE_ALL) {
          suite.tests.forEach(function(test) {
            test.pending = true;
          });
          suite.suites.forEach(function(suite) {
            suite.pending = true;
          });
        } else {
          hook.pending = false;
          var errForbid = createUnsupportedError('`this.skip` forbidden');
          self.failHook(hook, errForbid);
          return fn(errForbid);
        }
      } else if (err) {
        self.failHook(hook, err);
        // stop executing hooks, notify callee of hook err
        return fn(err);
      }
      self.emit(constants.EVENT_HOOK_END, hook);
      delete hook.ctx.currentTest;
      next(++i);
    });
  }

  Runner.immediately(function() {
    next(0);
  });
};

/**
 * Run hook `name` for the given array of `suites`
 * in order, and callback `fn(err, errSuite)`.
 *
 * @private
 * @param {string} name
 * @param {Array} suites
 * @param {Function} fn
 */
Runner.prototype.hooks = function(name, suites, fn) {
  var self = this;
  var orig = this.suite;

  function next(suite) {
    self.suite = suite;

    if (!suite) {
      self.suite = orig;
      return fn();
    }

    self.hook(name, function(err) {
      if (err) {
        var errSuite = self.suite;
        self.suite = orig;
        return fn(err, errSuite);
      }

      next(suites.pop());
    });
  }

  next(suites.pop());
};

/**
 * Run hooks from the top level down.
 *
 * @param {String} name
 * @param {Function} fn
 * @private
 */
Runner.prototype.hookUp = function(name, fn) {
  var suites = [this.suite].concat(this.parents()).reverse();
  this.hooks(name, suites, fn);
};

/**
 * Run hooks from the bottom up.
 *
 * @param {String} name
 * @param {Function} fn
 * @private
 */
Runner.prototype.hookDown = function(name, fn) {
  var suites = [this.suite].concat(this.parents());
  this.hooks(name, suites, fn);
};

/**
 * Return an array of parent Suites from
 * closest to furthest.
 *
 * @return {Array}
 * @private
 */
Runner.prototype.parents = function() {
  var suite = this.suite;
  var suites = [];
  while (suite.parent) {
    suite = suite.parent;
    suites.push(suite);
  }
  return suites;
};

/**
 * Run the current test and callback `fn(err)`.
 *
 * @param {Function} fn
 * @private
 */
Runner.prototype.runTest = function(fn) {
  var self = this;
  var test = this.test;

  if (!test) {
    return;
  }

  if (this.asyncOnly) {
    test.asyncOnly = true;
  }
  this._addEventListener(test, 'error', function(err) {
    self.fail(test, err);
  });
  if (this.allowUncaught) {
    test.allowUncaught = true;
    return test.run(fn);
  }
  try {
    test.run(fn);
  } catch (err) {
    fn(err);
  }
};

/**
 * Run tests in the given `suite` and invoke the callback `fn()` when complete.
 *
 * @private
 * @param {Suite} suite
 * @param {Function} fn
 */
Runner.prototype.runTests = function(suite, fn) {
  var self = this;
  var tests = suite.tests.slice();
  var test;

  function hookErr(_, errSuite, after) {
    // before/after Each hook for errSuite failed:
    var orig = self.suite;

    // for failed 'after each' hook start from errSuite parent,
    // otherwise start from errSuite itself
    self.suite = after ? errSuite.parent : errSuite;

    if (self.suite) {
      // call hookUp afterEach
      self.hookUp(HOOK_TYPE_AFTER_EACH, function(err2, errSuite2) {
        self.suite = orig;
        // some hooks may fail even now
        if (err2) {
          return hookErr(err2, errSuite2, true);
        }
        // report error suite
        fn(errSuite);
      });
    } else {
      // there is no need calling other 'after each' hooks
      self.suite = orig;
      fn(errSuite);
    }
  }

  function next(err, errSuite) {
    // if we bail after first err
    if (self.failures && suite._bail) {
      tests = [];
    }

    if (self._abort) {
      return fn();
    }

    if (err) {
      return hookErr(err, errSuite, true);
    }

    // next test
    test = tests.shift();

    // all done
    if (!test) {
      return fn();
    }

    // grep
    var match = self._grep.test(test.fullTitle());
    if (self._invert) {
      match = !match;
    }
    if (!match) {
      // Run immediately only if we have defined a grep. When we
      // define a grep — It can cause maximum callstack error if
      // the grep is doing a large recursive loop by neglecting
      // all tests. The run immediately function also comes with
      // a performance cost. So we don't want to run immediately
      // if we run the whole test suite, because running the whole
      // test suite don't do any immediate recursive loops. Thus,
      // allowing a JS runtime to breathe.
      if (self._grep !== self._defaultGrep) {
        Runner.immediately(next);
      } else {
        next();
      }
      return;
    }

    // static skip, no hooks are executed
    if (test.isPending()) {
      if (self.forbidPending) {
        test.isPending = alwaysFalse;
        self.fail(test, new Error('Pending test forbidden'));
        delete test.isPending;
      } else {
        self.emit(constants.EVENT_TEST_PENDING, test);
      }
      self.emit(constants.EVENT_TEST_END, test);
      return next();
    }

    // execute test and hook(s)
    self.emit(constants.EVENT_TEST_BEGIN, (self.test = test));
    self.hookDown(HOOK_TYPE_BEFORE_EACH, function(err, errSuite) {
      // conditional skip within beforeEach
      if (test.isPending()) {
        if (self.forbidPending) {
          test.isPending = alwaysFalse;
          self.fail(test, new Error('Pending test forbidden'));
          delete test.isPending;
        } else {
          self.emit(constants.EVENT_TEST_PENDING, test);
        }
        self.emit(constants.EVENT_TEST_END, test);
        // skip inner afterEach hooks below errSuite level
        var origSuite = self.suite;
        self.suite = errSuite || self.suite;
        return self.hookUp(HOOK_TYPE_AFTER_EACH, function(e, eSuite) {
          self.suite = origSuite;
          next(e, eSuite);
        });
      }
      if (err) {
        return hookErr(err, errSuite, false);
      }
      self.currentRunnable = self.test;
      self.runTest(function(err) {
        test = self.test;
        // conditional skip within it
        if (test.pending) {
          if (self.forbidPending) {
            test.isPending = alwaysFalse;
            self.fail(test, new Error('Pending test forbidden'));
            delete test.isPending;
          } else {
            self.emit(constants.EVENT_TEST_PENDING, test);
          }
          self.emit(constants.EVENT_TEST_END, test);
          return self.hookUp(HOOK_TYPE_AFTER_EACH, next);
        } else if (err) {
          var retry = test.currentRetry();
          if (retry < test.retries()) {
            var clonedTest = test.clone();
            clonedTest.currentRetry(retry + 1);
            tests.unshift(clonedTest);

            self.emit(constants.EVENT_TEST_RETRY, test, err);

            // Early return + hook trigger so that it doesn't
            // increment the count wrong
            return self.hookUp(HOOK_TYPE_AFTER_EACH, next);
          } else {
            self.fail(test, err);
          }
          self.emit(constants.EVENT_TEST_END, test);
          return self.hookUp(HOOK_TYPE_AFTER_EACH, next);
        }

        test.state = STATE_PASSED;
        self.emit(constants.EVENT_TEST_PASS, test);
        self.emit(constants.EVENT_TEST_END, test);
        self.hookUp(HOOK_TYPE_AFTER_EACH, next);
      });
    });
  }

  this.next = next;
  this.hookErr = hookErr;
  next();
};

function alwaysFalse() {
  return false;
}

/**
 * Run the given `suite` and invoke the callback `fn()` when complete.
 *
 * @private
 * @param {Suite} suite
 * @param {Function} fn
 */
Runner.prototype.runSuite = function(suite, fn) {
  var i = 0;
  var self = this;
  var total = this.grepTotal(suite);

  debug('runSuite(): running %s', suite.fullTitle());

  if (!total || (self.failures && suite._bail)) {
    debug('runSuite(): bailing');
    return fn();
  }

  this.emit(constants.EVENT_SUITE_BEGIN, (this.suite = suite));

  function next(errSuite) {
    if (errSuite) {
      // current suite failed on a hook from errSuite
      if (errSuite === suite) {
        // if errSuite is current suite
        // continue to the next sibling suite
        return done();
      }
      // errSuite is among the parents of current suite
      // stop execution of errSuite and all sub-suites
      return done(errSuite);
    }

    if (self._abort) {
      return done();
    }

    var curr = suite.suites[i++];
    if (!curr) {
      return done();
    }

    // Avoid grep neglecting large number of tests causing a
    // huge recursive loop and thus a maximum call stack error.
    // See comment in `this.runTests()` for more information.
    if (self._grep !== self._defaultGrep) {
      Runner.immediately(function() {
        self.runSuite(curr, next);
      });
    } else {
      self.runSuite(curr, next);
    }
  }

  function done(errSuite) {
    self.suite = suite;
    self.nextSuite = next;

    // remove reference to test
    delete self.test;

    self.hook(HOOK_TYPE_AFTER_ALL, function() {
      self.emit(constants.EVENT_SUITE_END, suite);
      fn(errSuite);
    });
  }

  this.nextSuite = next;

  this.hook(HOOK_TYPE_BEFORE_ALL, function(err) {
    if (err) {
      return done();
    }
    self.runTests(suite, next);
  });
};

/**
 * Handle uncaught exceptions within runner.
 *
 * This function is bound to the instance as `Runner#uncaught` at instantiation
 * time. It's intended to be listening on the `Process.uncaughtException` event.
 * In order to not leak EE listeners, we need to ensure no more than a single
 * `uncaughtException` listener exists per `Runner`.  The only way to do
 * this--because this function needs the context (and we don't have lambdas)--is
 * to use `Function.prototype.bind`. We need strict equality to unregister and
 * _only_ unregister the _one_ listener we set from the
 * `Process.uncaughtException` event; would be poor form to just remove
 * everything. See {@link Runner#run} for where the event listener is registered
 * and unregistered.
 * @param {Error} err - Some uncaught error
 * @private
 */
Runner.prototype._uncaught = function(err) {
  // this is defensive to prevent future developers from mis-calling this function.
  // it's more likely that it'd be called with the incorrect context--say, the global
  // `process` object--than it would to be called with a context that is not a "subclass"
  // of `Runner`.
  if (!(this instanceof Runner)) {
    throw createFatalError(
      'Runner#uncaught() called with invalid context',
      this
    );
  }
  if (err instanceof Pending) {
    debug('uncaught(): caught a Pending');
    return;
  }
  // browser does not exit script when throwing in global.onerror()
  if (this.allowUncaught && !process.browser) {
    debug('uncaught(): bubbling exception due to --allow-uncaught');
    throw err;
  }

  if (this.state === constants.STATE_STOPPED) {
    debug('uncaught(): throwing after run has completed!');
    throw err;
  }

  if (err) {
    debug('uncaught(): got truthy exception %O', err);
  } else {
    debug('uncaught(): undefined/falsy exception');
    err = createInvalidExceptionError(
      'Caught falsy/undefined exception which would otherwise be uncaught. No stack trace found; try a debugger',
      err
    );
  }

  if (!isError(err)) {
    err = thrown2Error(err);
    debug('uncaught(): converted "error" %o to Error', err);
  }
  err.uncaught = true;

  var runnable = this.currentRunnable;

  if (!runnable) {
    runnable = new Runnable('Uncaught error outside test suite');
    debug('uncaught(): no current Runnable; created a phony one');
    runnable.parent = this.suite;

    if (this.state === constants.STATE_RUNNING) {
      debug('uncaught(): failing gracefully');
      this.fail(runnable, err);
    } else {
      // Can't recover from this failure
      debug('uncaught(): test run has not yet started; unrecoverable');
      this.emit(constants.EVENT_RUN_BEGIN);
      this.fail(runnable, err);
      this.emit(constants.EVENT_RUN_END);
    }

    return;
  }

  runnable.clearTimeout();

  if (runnable.isFailed()) {
    debug('uncaught(): Runnable has already failed');
    // Ignore error if already failed
    return;
  } else if (runnable.isPending()) {
    debug('uncaught(): pending Runnable wound up failing!');
    // report 'pending test' retrospectively as failed
    runnable.isPending = alwaysFalse;
    this.fail(runnable, err);
    delete runnable.isPending;
    return;
  }

  // we cannot recover gracefully if a Runnable has already passed
  // then fails asynchronously
  if (runnable.isPassed()) {
    debug('uncaught(): Runnable has already passed; bailing gracefully');
    this.fail(runnable, err);
    this.abort();
  } else {
    debug('uncaught(): forcing Runnable to complete with Error');
    return runnable.callback(err);
  }
};

/**
 * Run the root suite and invoke `fn(failures)`
 * on completion.
 *
 * @public
 * @memberof Runner
 * @param {Function} fn
 * @return {Runner} Runner instance.
 */
Runner.prototype.run = function(fn) {
  var self = this;
  var rootSuite = this.suite;

  fn = fn || function() {};

  function start() {
    debug('run(): starting');
    // If there is an `only` filter
    if (rootSuite.hasOnly()) {
      rootSuite.filterOnly();
      debug('run(): filtered exclusive Runnables');
    }
    self.state = constants.STATE_RUNNING;
    if (self._delay) {
      self.emit(constants.EVENT_DELAY_END);
      debug('run(): "delay" ended');
    }
    debug('run(): emitting %s', constants.EVENT_RUN_BEGIN);
    self.emit(constants.EVENT_RUN_BEGIN);
    debug('run(): emitted %s', constants.EVENT_RUN_BEGIN);

    self.runSuite(rootSuite, function() {
      debug(
        'run(): root suite completed; emitting %s',
        constants.EVENT_RUN_END
      );
      self.emit(constants.EVENT_RUN_END);
      debug('run(): emitted %s', constants.EVENT_RUN_END);
    });
  }

  // references cleanup to avoid memory leaks
  if (this._opts.cleanReferencesAfterRun) {
    this.on(constants.EVENT_SUITE_END, function(suite) {
      suite.cleanReferences();
    });
  }

  // callback
  this.on(constants.EVENT_RUN_END, function() {
    self.state = constants.STATE_STOPPED;
    debug(constants.EVENT_RUN_END);
    debug('run(): emitted %s', constants.EVENT_RUN_END);
    fn(self.failures);
  });

  self._removeEventListener(process, 'uncaughtException', self.uncaught);
  self._addEventListener(process, 'uncaughtException', self.uncaught);

  if (this._delay) {
    // for reporters, I guess.
    // might be nice to debounce some dots while we wait.
    this.emit(constants.EVENT_DELAY_BEGIN, rootSuite);
    rootSuite.once(EVENT_ROOT_SUITE_RUN, start);
    debug('run(): waiting for green light due to --delay');
  } else {
    Runner.immediately(function() {
      start();
    });
  }

  return this;
};

/**
 * Cleanly abort execution.
 *
 * @memberof Runner
 * @public
 * @return {Runner} Runner instance.
 */
Runner.prototype.abort = function() {
  debug('abort(): aborting');
  this._abort = true;

  return this;
};

/**
 * Filter leaks with the given globals flagged as `ok`.
 *
 * @private
 * @param {Array} ok
 * @param {Array} globals
 * @return {Array}
 */
function filterLeaks(ok, globals) {
  return globals.filter(function(key) {
    // Firefox and Chrome exposes iframes as index inside the window object
    if (/^\d+/.test(key)) {
      return false;
    }

    // in firefox
    // if runner runs in an iframe, this iframe's window.getInterface method
    // not init at first it is assigned in some seconds
    if (global.navigator && /^getInterface/.test(key)) {
      return false;
    }

    // an iframe could be approached by window[iframeIndex]
    // in ie6,7,8 and opera, iframeIndex is enumerable, this could cause leak
    if (global.navigator && /^\d+/.test(key)) {
      return false;
    }

    // Opera and IE expose global variables for HTML element IDs (issue #243)
    if (/^mocha-/.test(key)) {
      return false;
    }

    var matched = ok.filter(function(ok) {
      if (~ok.indexOf('*')) {
        return key.indexOf(ok.split('*')[0]) === 0;
      }
      return key === ok;
    });
    return !matched.length && (!global.navigator || key !== 'onerror');
  });
}

/**
 * Check if argument is an instance of Error object or a duck-typed equivalent.
 *
 * @private
 * @param {Object} err - object to check
 * @param {string} err.message - error message
 * @returns {boolean}
 */
function isError(err) {
  return err instanceof Error || (err && typeof err.message === 'string');
}

/**
 *
 * Converts thrown non-extensible type into proper Error.
 *
 * @private
 * @param {*} thrown - Non-extensible type thrown by code
 * @return {Error}
 */
function thrown2Error(err) {
  return new Error(
    'the ' + type(err) + ' ' + stringify(err) + ' was thrown, throw an Error :)'
  );
}

Runner.constants = constants;

/**
 * Node.js' `EventEmitter`
 * @external EventEmitter
 * @see {@link https://nodejs.org/api/events.html#events_class_eventemitter}
 */
