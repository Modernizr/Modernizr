'use strict';

const path = require('path');
const ansi = require('ansi-colors');
const debug = require('debug')('mocha:cli:run:helpers');
const minimatch = require('minimatch');
const utils = require('../utils');
const {NO_FILES_MATCH_PATTERN} = require('../errors').constants;

/**
 * Exports a function that collects test files from CLI parameters.
 * @see module:lib/cli/run-helpers
 * @see module:lib/cli/watch-run
 * @module
 * @private
 */

/**
 * Smash together an array of test files in the correct order
 * @param {Object} opts - Options
 * @param {string[]} opts.extension - File extensions to use
 * @param {string[]} opts.spec - Files, dirs, globs to run
 * @param {string[]} opts.ignore - Files, dirs, globs to ignore
 * @param {string[]} opts.file - List of additional files to include
 * @param {boolean} opts.recursive - Find files recursively
 * @param {boolean} opts.sort - Sort test files
 * @returns {string[]} List of files to test
 * @private
 */
module.exports = ({ignore, extension, file, recursive, sort, spec} = {}) => {
  let files = [];
  const unmatched = [];
  spec.forEach(arg => {
    let newFiles;
    try {
      newFiles = utils.lookupFiles(arg, extension, recursive);
    } catch (err) {
      if (err.code === NO_FILES_MATCH_PATTERN) {
        unmatched.push({message: err.message, pattern: err.pattern});
        return;
      }

      throw err;
    }

    if (typeof newFiles !== 'undefined') {
      if (typeof newFiles === 'string') {
        newFiles = [newFiles];
      }
      newFiles = newFiles.filter(fileName =>
        ignore.every(pattern => !minimatch(fileName, pattern))
      );
    }

    files = files.concat(newFiles);
  });

  const fileArgs = file.map(filepath => path.resolve(filepath));
  files = files.map(filepath => path.resolve(filepath));

  // ensure we don't sort the stuff from fileArgs; order is important!
  if (sort) {
    files.sort();
  }

  // add files given through --file to be ran first
  files = fileArgs.concat(files);
  debug('files (in order): ', files);

  if (!files.length) {
    // give full message details when only 1 file is missing
    const noneFoundMsg =
      unmatched.length === 1
        ? `Error: No test files found: ${JSON.stringify(unmatched[0].pattern)}` // stringify to print escaped characters raw
        : 'Error: No test files found';
    console.error(ansi.red(noneFoundMsg));
    process.exit(1);
  } else {
    // print messages as an warning
    unmatched.forEach(warning => {
      console.warn(ansi.yellow(`Warning: ${warning.message}`));
    });
  }

  return files;
};
