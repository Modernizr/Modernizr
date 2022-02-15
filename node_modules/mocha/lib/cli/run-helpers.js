'use strict';

/**
 * Helper scripts for the `run` command
 * @see module:lib/cli/run
 * @module
 * @private
 */

const fs = require('fs');
const path = require('path');
const debug = require('debug')('mocha:cli:run:helpers');
const watchRun = require('./watch-run');
const collectFiles = require('./collect-files');
const {type} = require('../utils');
const {format} = require('util');
const {createInvalidPluginError, createUnsupportedError} = require('../errors');

/**
 * Exits Mocha when tests + code under test has finished execution (default)
 * @param {number} code - Exit code; typically # of failures
 * @ignore
 * @private
 */
const exitMochaLater = code => {
  process.on('exit', () => {
    process.exitCode = Math.min(code, 255);
  });
};

/**
 * Exits Mocha when Mocha itself has finished execution, regardless of
 * what the tests or code under test is doing.
 * @param {number} code - Exit code; typically # of failures
 * @ignore
 * @private
 */
const exitMocha = code => {
  const clampedCode = Math.min(code, 255);
  let draining = 0;

  // Eagerly set the process's exit code in case stream.write doesn't
  // execute its callback before the process terminates.
  process.exitCode = clampedCode;

  // flush output for Node.js Windows pipe bug
  // https://github.com/joyent/node/issues/6247 is just one bug example
  // https://github.com/visionmedia/mocha/issues/333 has a good discussion
  const done = () => {
    if (!draining--) {
      process.exit(clampedCode);
    }
  };

  const streams = [process.stdout, process.stderr];

  streams.forEach(stream => {
    // submit empty write request and wait for completion
    draining += 1;
    stream.write('', done);
  });

  done();
};

/**
 * Coerce a comma-delimited string (or array thereof) into a flattened array of
 * strings
 * @param {string|string[]} str - Value to coerce
 * @returns {string[]} Array of strings
 * @private
 */
exports.list = str =>
  Array.isArray(str) ? exports.list(str.join(',')) : str.split(/ *, */);

/**
 * `require()` the modules as required by `--require <require>`.
 *
 * Returns array of `mochaHooks` exports, if any.
 * @param {string[]} requires - Modules to require
 * @returns {Promise<MochaRootHookObject|MochaRootHookFunction>} Any root hooks
 * @private
 */
exports.handleRequires = async (requires = []) =>
  requires.reduce((acc, mod) => {
    let modpath = mod;
    // this is relative to cwd
    if (fs.existsSync(mod) || fs.existsSync(`${mod}.js`)) {
      modpath = path.resolve(mod);
      debug('resolved required file %s to %s', mod, modpath);
    }
    const requiredModule = require(modpath);
    if (type(requiredModule) === 'object' && requiredModule.mochaHooks) {
      const mochaHooksType = type(requiredModule.mochaHooks);
      if (/function$/.test(mochaHooksType) || mochaHooksType === 'object') {
        debug('found root hooks in required file %s', mod);
        acc.push(requiredModule.mochaHooks);
      } else {
        throw createUnsupportedError(
          'mochaHooks must be an object or a function returning (or fulfilling with) an object'
        );
      }
    }
    debug('loaded required module "%s"', mod);
    return acc;
  }, []);

/**
 * Loads root hooks as exported via `mochaHooks` from required files.
 * These can be sync/async functions returning objects, or just objects.
 * Flattens to a single object.
 * @param {Array<MochaRootHookObject|MochaRootHookFunction>} rootHooks - Array of root hooks
 * @private
 * @returns {MochaRootHookObject}
 */
exports.loadRootHooks = async rootHooks => {
  const rootHookObjects = await Promise.all(
    rootHooks.map(async hook => (/function$/.test(type(hook)) ? hook() : hook))
  );

  return rootHookObjects.reduce(
    (acc, hook) => {
      acc.beforeAll = acc.beforeAll.concat(hook.beforeAll || []);
      acc.beforeEach = acc.beforeEach.concat(hook.beforeEach || []);
      acc.afterAll = acc.afterAll.concat(hook.afterAll || []);
      acc.afterEach = acc.afterEach.concat(hook.afterEach || []);
      return acc;
    },
    {beforeAll: [], beforeEach: [], afterAll: [], afterEach: []}
  );
};

/**
 * Collect and load test files, then run mocha instance.
 * @param {Mocha} mocha - Mocha instance
 * @param {Options} [opts] - Command line options
 * @param {boolean} [opts.exit] - Whether or not to force-exit after tests are complete
 * @param {Object} fileCollectParams - Parameters that control test
 *   file collection. See `lib/cli/collect-files.js`.
 * @returns {Promise<Runner>}
 * @private
 */
const singleRun = async (mocha, {exit}, fileCollectParams) => {
  const files = collectFiles(fileCollectParams);
  debug('single run with %d file(s)', files.length);
  mocha.files = files;

  // handles ESM modules
  await mocha.loadFilesAsync();
  return mocha.run(exit ? exitMocha : exitMochaLater);
};

/**
 * Actually run tests
 * @param {Mocha} mocha - Mocha instance
 * @param {Object} opts - Command line options
 * @private
 * @returns {Promise}
 */
exports.runMocha = async (mocha, options) => {
  const {
    watch = false,
    extension = [],
    exit = false,
    ignore = [],
    file = [],
    recursive = false,
    sort = false,
    spec = [],
    watchFiles,
    watchIgnore
  } = options;

  const fileCollectParams = {
    ignore,
    extension,
    file,
    recursive,
    sort,
    spec
  };

  if (watch) {
    watchRun(mocha, {watchFiles, watchIgnore}, fileCollectParams);
  } else {
    await singleRun(mocha, {exit}, fileCollectParams);
  }
};

/**
 * Used for `--reporter` and `--ui`.  Ensures there's only one, and asserts that
 * it actually exists. This must be run _after_ requires are processed (see
 * {@link handleRequires}), as it'll prevent interfaces from loading otherwise.
 * @param {Object} opts - Options object
 * @param {"reporter"|"interface"} pluginType - Type of plugin.
 * @param {Object} [map] - An object perhaps having key `key`. Used as a cache
 * of sorts; `Mocha.reporters` is one, where each key corresponds to a reporter
 * name
 * @private
 */
exports.validatePlugin = (opts, pluginType, map = {}) => {
  /**
   * This should be a unique identifier; either a string (present in `map`),
   * or a resolvable (via `require.resolve`) module ID/path.
   * @type {string}
   */
  const pluginId = opts[pluginType];

  if (Array.isArray(pluginId)) {
    throw createInvalidPluginError(
      `"--${pluginType}" can only be specified once`,
      pluginType
    );
  }

  const unknownError = err =>
    createInvalidPluginError(
      format('Could not load %s "%s":\n\n %O', pluginType, pluginId, err),
      pluginType,
      pluginId
    );

  // if this exists, then it's already loaded, so nothing more to do.
  if (!map[pluginId]) {
    try {
      opts[pluginType] = require(pluginId);
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        // Try to load reporters from a path (absolute or relative)
        try {
          opts[pluginType] = require(path.resolve(pluginId));
        } catch (err) {
          throw unknownError(err);
        }
      } else {
        throw unknownError(err);
      }
    }
  }
};
