'use strict';

/**
 * Main entry point for handling filesystem-based configuration,
 * whether that's `mocha.opts` or a config file or `package.json` or whatever.
 * @module
 */

const fs = require('fs');
const ansi = require('ansi-colors');
const yargsParser = require('yargs-parser');
const {types, aliases} = require('./run-option-metadata');
const {ONE_AND_DONE_ARGS} = require('./one-and-dones');
const mocharc = require('../mocharc.json');
const {list} = require('./run-helpers');
const {loadConfig, findConfig} = require('./config');
const findUp = require('find-up');
const {deprecate} = require('../utils');
const debug = require('debug')('mocha:cli:options');
const {isNodeFlag} = require('./node-flags');

/**
 * The `yargs-parser` namespace
 * @external yargsParser
 * @see {@link https://npm.im/yargs-parser}
 */

/**
 * An object returned by a configured `yargs-parser` representing arguments
 * @memberof external:yargsParser
 * @interface Arguments
 */

/**
 * Base yargs parser configuration
 * @private
 */
const YARGS_PARSER_CONFIG = {
  'combine-arrays': true,
  'short-option-groups': false,
  'dot-notation': false
};

/**
 * This is the config pulled from the `yargs` property of Mocha's
 * `package.json`, but it also disables camel case expansion as to
 * avoid outputting non-canonical keynames, as we need to do some
 * lookups.
 * @private
 * @ignore
 */
const configuration = Object.assign({}, YARGS_PARSER_CONFIG, {
  'camel-case-expansion': false
});

/**
 * This is a really fancy way to:
 * - ensure unique values for `array`-type options
 * - use its array's last element for `boolean`/`number`/`string`- options given multiple times
 * This is passed as the `coerce` option to `yargs-parser`
 * @private
 * @ignore
 */
const coerceOpts = Object.assign(
  types.array.reduce(
    (acc, arg) =>
      Object.assign(acc, {[arg]: v => Array.from(new Set(list(v)))}),
    {}
  ),
  types.boolean
    .concat(types.string, types.number)
    .reduce(
      (acc, arg) =>
        Object.assign(acc, {[arg]: v => (Array.isArray(v) ? v.pop() : v)}),
      {}
    )
);

/**
 * We do not have a case when multiple arguments are ever allowed after a flag
 * (e.g., `--foo bar baz quux`), so we fix the number of arguments to 1 across
 * the board of non-boolean options.
 * This is passed as the `narg` option to `yargs-parser`
 * @private
 * @ignore
 */
const nargOpts = types.array
  .concat(types.string, types.number)
  .reduce((acc, arg) => Object.assign(acc, {[arg]: 1}), {});

/**
 * Wrapper around `yargs-parser` which applies our settings
 * @param {string|string[]} args - Arguments to parse
 * @param {Object} defaultValues - Default values of mocharc.json
 * @param  {...Object} configObjects - `configObjects` for yargs-parser
 * @private
 * @ignore
 */
const parse = (args = [], defaultValues = {}, ...configObjects) => {
  // save node-specific args for special handling.
  // 1. when these args have a "=" they should be considered to have values
  // 2. if they don't, they just boolean flags
  // 3. to avoid explicitly defining the set of them, we tell yargs-parser they
  //    are ALL boolean flags.
  // 4. we can then reapply the values after yargs-parser is done.
  const nodeArgs = (Array.isArray(args) ? args : args.split(' ')).reduce(
    (acc, arg) => {
      const pair = arg.split('=');
      let flag = pair[0];
      if (isNodeFlag(flag, false)) {
        flag = flag.replace(/^--?/, '');
        return arg.includes('=')
          ? acc.concat([[flag, pair[1]]])
          : acc.concat([[flag, true]]);
      }
      return acc;
    },
    []
  );

  const result = yargsParser.detailed(args, {
    configuration,
    configObjects,
    default: defaultValues,
    coerce: coerceOpts,
    narg: nargOpts,
    alias: aliases,
    string: types.string,
    array: types.array,
    number: types.number,
    boolean: types.boolean.concat(nodeArgs.map(pair => pair[0]))
  });
  if (result.error) {
    console.error(ansi.red(`Error: ${result.error.message}`));
    process.exit(1);
  }

  // reapply "=" arg values from above
  nodeArgs.forEach(([key, value]) => {
    result.argv[key] = value;
  });

  return result.argv;
};

/**
 * - Replaces comments with empty strings
 * - Replaces escaped spaces (e.g., 'xxx\ yyy') with HTML space
 * - Splits on whitespace, creating array of substrings
 * - Filters empty string elements from array
 * - Replaces any HTML space with space
 * @summary Parses options read from run-control file.
 * @private
 * @param {string} content - Content read from run-control file.
 * @returns {string[]} cmdline options (and associated arguments)
 * @ignore
 */
const parseMochaOpts = content =>
  content
    .replace(/^#.*$/gm, '')
    .replace(/\\\s/g, '%20')
    .split(/\s/)
    .filter(Boolean)
    .map(value => value.replace(/%20/g, ' '));

/**
 * Given filepath in `args.opts`, attempt to load and parse a `mocha.opts` file.
 * @param {Object} [args] - Arguments object
 * @param {string|boolean} [args.opts] - Filepath to mocha.opts; defaults to whatever's in `mocharc.opts`, or `false` to skip
 * @returns {external:yargsParser.Arguments|void} If read, object containing parsed arguments
 * @memberof module:lib/cli/options
 * @see {@link /#mochaopts|mocha.opts}
 * @public
 */
const loadMochaOpts = (args = {}) => {
  let result;
  let filepath = args.opts;
  // /dev/null is backwards compat
  if (filepath === false || filepath === '/dev/null') {
    return result;
  }
  filepath = filepath || mocharc.opts;
  result = {};
  let mochaOpts;
  try {
    mochaOpts = fs.readFileSync(filepath, 'utf8');
    debug(`read ${filepath}`);
  } catch (err) {
    if (args.opts) {
      throw new Error(`Unable to read ${filepath}: ${err}`);
    }
    // ignore otherwise.  we tried
    debug(`No mocha.opts found at ${filepath}`);
  }

  // real args should override `mocha.opts` which should override defaults.
  // if there's an exception to catch here, I'm not sure what it is.
  // by attaching the `no-opts` arg, we avoid re-parsing of `mocha.opts`.
  if (mochaOpts) {
    deprecate(
      'Configuration via mocha.opts is DEPRECATED and will be removed from a future version of Mocha. Use RC files or package.json instead.'
    );
    result = parse(parseMochaOpts(mochaOpts));
    debug(`${filepath} parsed succesfully`);
  }
  return result;
};

module.exports.loadMochaOpts = loadMochaOpts;

/**
 * Given path to config file in `args.config`, attempt to load & parse config file.
 * @param {Object} [args] - Arguments object
 * @param {string|boolean} [args.config] - Path to config file or `false` to skip
 * @public
 * @memberof module:lib/cli/options
 * @returns {external:yargsParser.Arguments|void} Parsed config, or nothing if `args.config` is `false`
 */
const loadRc = (args = {}) => {
  if (args.config !== false) {
    const config = args.config || findConfig();
    return config ? loadConfig(config) : {};
  }
};

module.exports.loadRc = loadRc;

/**
 * Given path to `package.json` in `args.package`, attempt to load config from `mocha` prop.
 * @param {Object} [args] - Arguments object
 * @param {string|boolean} [args.config] - Path to `package.json` or `false` to skip
 * @public
 * @memberof module:lib/cli/options
 * @returns {external:yargsParser.Arguments|void} Parsed config, or nothing if `args.package` is `false`
 */
const loadPkgRc = (args = {}) => {
  let result;
  if (args.package === false) {
    return result;
  }
  result = {};
  const filepath = args.package || findUp.sync(mocharc.package);
  if (filepath) {
    try {
      const pkg = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      if (pkg.mocha) {
        debug('`mocha` prop of package.json parsed: %O', pkg.mocha);
        result = pkg.mocha;
      } else {
        debug('no config found in %s', filepath);
      }
    } catch (err) {
      if (args.package) {
        throw new Error(`Unable to read/parse ${filepath}: ${err}`);
      }
      debug('failed to read default package.json at %s; ignoring', filepath);
    }
  }
  return result;
};

module.exports.loadPkgRc = loadPkgRc;

/**
 * Priority list:
 *
 * 1. Command-line args
 * 2. RC file (`.mocharc.c?js`, `.mocharc.ya?ml`, `mocharc.json`)
 * 3. `mocha` prop of `package.json`
 * 4. `mocha.opts`
 * 5. default configuration (`lib/mocharc.json`)
 *
 * If a {@link module:lib/cli/one-and-dones.ONE_AND_DONE_ARGS "one-and-done" option} is present in the `argv` array, no external config files will be read.
 * @summary Parses options read from `mocha.opts`, `.mocharc.*` and `package.json`.
 * @param {string|string[]} [argv] - Arguments to parse
 * @public
 * @memberof module:lib/cli/options
 * @returns {external:yargsParser.Arguments} Parsed args from everything
 */
const loadOptions = (argv = []) => {
  let args = parse(argv);
  // short-circuit: look for a flag that would abort loading of mocha.opts
  if (
    Array.from(ONE_AND_DONE_ARGS).reduce(
      (acc, arg) => acc || arg in args,
      false
    )
  ) {
    return args;
  }

  const rcConfig = loadRc(args);
  const pkgConfig = loadPkgRc(args);
  const optsConfig = loadMochaOpts(args);

  if (rcConfig) {
    args.config = false;
    args._ = args._.concat(rcConfig._ || []);
  }
  if (pkgConfig) {
    args.package = false;
    args._ = args._.concat(pkgConfig._ || []);
  }
  if (optsConfig) {
    args.opts = false;
    args._ = args._.concat(optsConfig._ || []);
  }

  args = parse(
    args._,
    mocharc,
    args,
    rcConfig || {},
    pkgConfig || {},
    optsConfig || {}
  );

  // recombine positional arguments and "spec"
  if (args.spec) {
    args._ = args._.concat(args.spec);
    delete args.spec;
  }

  // make unique
  args._ = Array.from(new Set(args._));

  return args;
};

module.exports.loadOptions = loadOptions;
module.exports.YARGS_PARSER_CONFIG = YARGS_PARSER_CONFIG;
