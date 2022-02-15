'use strict';

var format = require('util').format;

/**
 * Factory functions to create throwable error objects
 * @module Errors
 */

/**
 * When Mocha throw exceptions (or otherwise errors), it attempts to assign a
 * `code` property to the `Error` object, for easier handling.  These are the
 * potential values of `code`.
 */
var constants = {
  /**
   * An unrecoverable error.
   */
  FATAL: 'ERR_MOCHA_FATAL',

  /**
   * The type of an argument to a function call is invalid
   */
  INVALID_ARG_TYPE: 'ERR_MOCHA_INVALID_ARG_TYPE',

  /**
   * The value of an argument to a function call is invalid
   */
  INVALID_ARG_VALUE: 'ERR_MOCHA_INVALID_ARG_VALUE',

  /**
   * Something was thrown, but it wasn't an `Error`
   */
  INVALID_EXCEPTION: 'ERR_MOCHA_INVALID_EXCEPTION',

  /**
   * An interface (e.g., `Mocha.interfaces`) is unknown or invalid
   */
  INVALID_INTERFACE: 'ERR_MOCHA_INVALID_INTERFACE',

  /**
   * A reporter (.e.g, `Mocha.reporters`) is unknown or invalid
   */
  INVALID_REPORTER: 'ERR_MOCHA_INVALID_REPORTER',

  /**
   * `done()` was called twice in a `Test` or `Hook` callback
   */
  MULTIPLE_DONE: 'ERR_MOCHA_MULTIPLE_DONE',

  /**
   * No files matched the pattern provided by the user
   */
  NO_FILES_MATCH_PATTERN: 'ERR_MOCHA_NO_FILES_MATCH_PATTERN',

  /**
   * Known, but unsupported behavior of some kind
   */
  UNSUPPORTED: 'ERR_MOCHA_UNSUPPORTED',

  /**
   * Invalid state transition occuring in `Mocha` instance
   */
  INSTANCE_ALREADY_RUNNING: 'ERR_MOCHA_INSTANCE_ALREADY_RUNNING',

  /**
   * Invalid state transition occuring in `Mocha` instance
   */
  INSTANCE_ALREADY_DISPOSED: 'ERR_MOCHA_INSTANCE_ALREADY_DISPOSED'
};

/**
 * Creates an error object to be thrown when no files to be tested could be found using specified pattern.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @param {string} pattern - User-specified argument value.
 * @returns {Error} instance detailing the error condition
 */
function createNoFilesMatchPatternError(message, pattern) {
  var err = new Error(message);
  err.code = constants.NO_FILES_MATCH_PATTERN;
  err.pattern = pattern;
  return err;
}

/**
 * Creates an error object to be thrown when the reporter specified in the options was not found.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @param {string} reporter - User-specified reporter value.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidReporterError(message, reporter) {
  var err = new TypeError(message);
  err.code = constants.INVALID_REPORTER;
  err.reporter = reporter;
  return err;
}

/**
 * Creates an error object to be thrown when the interface specified in the options was not found.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @param {string} ui - User-specified interface value.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidInterfaceError(message, ui) {
  var err = new Error(message);
  err.code = constants.INVALID_INTERFACE;
  err.interface = ui;
  return err;
}

/**
 * Creates an error object to be thrown when a behavior, option, or parameter is unsupported.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @returns {Error} instance detailing the error condition
 */
function createUnsupportedError(message) {
  var err = new Error(message);
  err.code = constants.UNSUPPORTED;
  return err;
}

/**
 * Creates an error object to be thrown when an argument is missing.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @param {string} argument - Argument name.
 * @param {string} expected - Expected argument datatype.
 * @returns {Error} instance detailing the error condition
 */
function createMissingArgumentError(message, argument, expected) {
  return createInvalidArgumentTypeError(message, argument, expected);
}

/**
 * Creates an error object to be thrown when an argument did not use the supported type
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @param {string} argument - Argument name.
 * @param {string} expected - Expected argument datatype.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidArgumentTypeError(message, argument, expected) {
  var err = new TypeError(message);
  err.code = constants.INVALID_ARG_TYPE;
  err.argument = argument;
  err.expected = expected;
  err.actual = typeof argument;
  return err;
}

/**
 * Creates an error object to be thrown when an argument did not use the supported value
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @param {string} argument - Argument name.
 * @param {string} value - Argument value.
 * @param {string} [reason] - Why value is invalid.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidArgumentValueError(message, argument, value, reason) {
  var err = new TypeError(message);
  err.code = constants.INVALID_ARG_VALUE;
  err.argument = argument;
  err.value = value;
  err.reason = typeof reason !== 'undefined' ? reason : 'is invalid';
  return err;
}

/**
 * Creates an error object to be thrown when an exception was caught, but the `Error` is falsy or undefined.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @returns {Error} instance detailing the error condition
 */
function createInvalidExceptionError(message, value) {
  var err = new Error(message);
  err.code = constants.INVALID_EXCEPTION;
  err.valueType = typeof value;
  err.value = value;
  return err;
}

/**
 * Creates an error object to be thrown when an unrecoverable error occurs.
 *
 * @public
 * @param {string} message - Error message to be displayed.
 * @returns {Error} instance detailing the error condition
 */
function createFatalError(message, value) {
  var err = new Error(message);
  err.code = constants.FATAL;
  err.valueType = typeof value;
  err.value = value;
  return err;
}

/**
 * Dynamically creates a plugin-type-specific error based on plugin type
 * @param {string} message - Error message
 * @param {"reporter"|"interface"} pluginType - Plugin type. Future: expand as needed
 * @param {string} [pluginId] - Name/path of plugin, if any
 * @throws When `pluginType` is not known
 * @public
 * @returns {Error}
 */
function createInvalidPluginError(message, pluginType, pluginId) {
  switch (pluginType) {
    case 'reporter':
      return createInvalidReporterError(message, pluginId);
    case 'interface':
      return createInvalidInterfaceError(message, pluginId);
    default:
      throw new Error('unknown pluginType "' + pluginType + '"');
  }
}

/**
 * Creates an error object to be thrown when a mocha object's `run` method is executed while it is already disposed.
 * @param {string} message The error message to be displayed.
 * @param {boolean} cleanReferencesAfterRun the value of `cleanReferencesAfterRun`
 * @param {Mocha} instance the mocha instance that throw this error
 */
function createMochaInstanceAlreadyDisposedError(
  message,
  cleanReferencesAfterRun,
  instance
) {
  var err = new Error(message);
  err.code = constants.INSTANCE_ALREADY_DISPOSED;
  err.cleanReferencesAfterRun = cleanReferencesAfterRun;
  err.instance = instance;
  return err;
}

/**
 * Creates an error object to be thrown when a mocha object's `run` method is called while a test run is in progress.
 * @param {string} message The error message to be displayed.
 */
function createMochaInstanceAlreadyRunningError(message, instance) {
  var err = new Error(message);
  err.code = constants.INSTANCE_ALREADY_RUNNING;
  err.instance = instance;
  return err;
}

/*
 * Creates an error object to be thrown when done() is called multiple times in a test
 *
 * @public
 * @param {Runnable} runnable - Original runnable
 * @param {Error} [originalErr] - Original error, if any
 * @returns {Error} instance detailing the error condition
 */
function createMultipleDoneError(runnable, originalErr) {
  var title;
  try {
    title = format('<%s>', runnable.fullTitle());
    if (runnable.parent.root) {
      title += ' (of root suite)';
    }
  } catch (ignored) {
    title = format('<%s> (of unknown suite)', runnable.title);
  }
  var message = format(
    'done() called multiple times in %s %s',
    runnable.type ? runnable.type : 'unknown runnable',
    title
  );
  if (runnable.file) {
    message += format(' of file %s', runnable.file);
  }
  if (originalErr) {
    message += format('; in addition, done() received error: %s', originalErr);
  }

  var err = new Error(message);
  err.code = constants.MULTIPLE_DONE;
  err.valueType = typeof originalErr;
  err.value = originalErr;
  return err;
}

module.exports = {
  createInvalidArgumentTypeError: createInvalidArgumentTypeError,
  createInvalidArgumentValueError: createInvalidArgumentValueError,
  createInvalidExceptionError: createInvalidExceptionError,
  createInvalidInterfaceError: createInvalidInterfaceError,
  createInvalidReporterError: createInvalidReporterError,
  createMissingArgumentError: createMissingArgumentError,
  createNoFilesMatchPatternError: createNoFilesMatchPatternError,
  createUnsupportedError: createUnsupportedError,
  createInvalidPluginError: createInvalidPluginError,
  createMochaInstanceAlreadyDisposedError: createMochaInstanceAlreadyDisposedError,
  createMochaInstanceAlreadyRunningError: createMochaInstanceAlreadyRunningError,
  createFatalError: createFatalError,
  createMultipleDoneError: createMultipleDoneError,
  constants: constants
};
