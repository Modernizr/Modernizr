'use strict';

/**
 * Metadata about various options of the `run` command
 * @see module:lib/cli/run
 * @module
 * @private
 */

/**
 * Dictionary of yargs option types to list of options having said type
 * @type {{string:string[]}}
 * @private
 */
exports.types = {
  array: [
    'extension',
    'file',
    'global',
    'ignore',
    'reporter-option',
    'require',
    'spec',
    'watch-files',
    'watch-ignore'
  ],
  boolean: [
    'allow-uncaught',
    'async-only',
    'bail',
    'check-leaks',
    'color',
    'delay',
    'diff',
    'exit',
    'forbid-only',
    'forbid-pending',
    'full-trace',
    'growl',
    'inline-diffs',
    'invert',
    'list-interfaces',
    'list-reporters',
    'no-colors',
    'recursive',
    'sort',
    'watch'
  ],
  number: ['retries'],
  string: [
    'config',
    'fgrep',
    'grep',
    'opts',
    'package',
    'reporter',
    'ui',
    'slow',
    'timeout'
  ]
};

/**
 * Option aliases keyed by canonical option name.
 * Arrays used to reduce
 * @type {{string:string[]}}
 * @private
 */
exports.aliases = {
  'async-only': ['A'],
  bail: ['b'],
  color: ['c', 'colors'],
  fgrep: ['f'],
  global: ['globals'],
  grep: ['g'],
  growl: ['G'],
  ignore: ['exclude'],
  invert: ['i'],
  'no-colors': ['C'],
  reporter: ['R'],
  'reporter-option': ['reporter-options', 'O'],
  require: ['r'],
  slow: ['s'],
  sort: ['S'],
  timeout: ['t', 'timeouts'],
  ui: ['u'],
  watch: ['w']
};
