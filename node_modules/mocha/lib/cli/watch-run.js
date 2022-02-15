'use strict';

const path = require('path');
const chokidar = require('chokidar');
const Context = require('../context');
const collectFiles = require('./collect-files');

/**
 * Exports the `watchRun` function that runs mocha in "watch" mode.
 * @see module:lib/cli/run-helpers
 * @module
 * @private
 */

/**
 * Run Mocha in "watch" mode
 * @param {Mocha} mocha - Mocha instance
 * @param {Object} opts - Options
 * @param {string[]} [opts.watchFiles] - List of paths and patterns to
 *   watch. If not provided all files with an extension included in
 *   `fileColletionParams.extension` are watched. See first argument of
 *   `chokidar.watch`.
 * @param {string[]} opts.watchIgnore - List of paths and patterns to
 *   exclude from watching. See `ignored` option of `chokidar`.
 * @param {Object} fileCollectParams - Parameters that control test
 *   file collection. See `lib/cli/collect-files.js`.
 * @param {string[]} fileCollectParams.extension - List of extensions
 *   to watch if `opts.watchFiles` is not given.
 * @private
 */
module.exports = (mocha, {watchFiles, watchIgnore}, fileCollectParams) => {
  if (!watchFiles) {
    watchFiles = fileCollectParams.extension.map(ext => `**/*.${ext}`);
  }

  const watcher = chokidar.watch(watchFiles, {
    ignored: watchIgnore,
    ignoreInitial: true
  });

  const rerunner = createRerunner(mocha, () => {
    getWatchedFiles(watcher).forEach(file => {
      delete require.cache[file];
    });
    mocha.files = collectFiles(fileCollectParams);
  });

  watcher.on('ready', () => {
    rerunner.run();
  });

  watcher.on('all', () => {
    rerunner.scheduleRun();
  });

  console.log();
  hideCursor();
  process.on('exit', () => {
    showCursor();
  });
  process.on('SIGINT', () => {
    showCursor();
    console.log('\n');
    process.exit(128 + 2);
  });

  // Keyboard shortcut for restarting when "rs\n" is typed (ala Nodemon)
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', data => {
    const str = data
      .toString()
      .trim()
      .toLowerCase();
    if (str === 'rs') rerunner.scheduleRun();
  });
};

/**
 * Create an object that allows you to rerun tests on the mocha
 * instance. `beforeRun` is called everytime before `mocha.run()` is
 * called.
 *
 * @param {Mocha} mocha - Mocha instance
 * @param {function} beforeRun - Called just before `mocha.run()`
 */
const createRerunner = (mocha, beforeRun) => {
  // Set to a `Runner` when mocha is running. Set to `null` when mocha is not
  // running.
  let runner = null;

  let rerunScheduled = false;

  const run = () => {
    try {
      beforeRun();
      resetMocha(mocha);
      runner = mocha.run(() => {
        runner = null;
        if (rerunScheduled) {
          rerun();
        }
      });
    } catch (e) {
      console.log(e.stack);
    }
  };

  const scheduleRun = () => {
    if (rerunScheduled) {
      return;
    }

    rerunScheduled = true;
    if (runner) {
      runner.abort();
    } else {
      rerun();
    }
  };

  const rerun = () => {
    rerunScheduled = false;
    eraseLine();
    run();
  };

  return {
    scheduleRun,
    run
  };
};

/**
 * Return the list of absolute paths watched by a chokidar watcher.
 *
 * @param watcher - Instance of a chokidar watcher
 * @return {string[]} - List of absolute paths
 */
const getWatchedFiles = watcher => {
  const watchedDirs = watcher.getWatched();
  let watchedFiles = [];
  Object.keys(watchedDirs).forEach(dir => {
    watchedFiles = watchedFiles.concat(
      watchedDirs[dir].map(file => path.join(dir, file))
    );
  });
  return watchedFiles;
};

/**
 * Reset the internal state of the mocha instance so that tests can be rerun.
 *
 * @param {Mocha} mocha - Mocha instance
 * @private
 */
const resetMocha = mocha => {
  mocha.unloadFiles();
  mocha.suite = mocha.suite.clone();
  mocha.suite.ctx = new Context();
  // Registers a callback on `mocha.suite` that wires new context to the DSL
  // (e.g. `describe`) that is exposed as globals when the test files are
  // reloaded.
  mocha.ui(mocha.options.ui);
};

/**
 * Hide the cursor.
 * @ignore
 * @private
 */
const hideCursor = () => {
  process.stdout.write('\u001b[?25l');
};

/**
 * Show the cursor.
 * @ignore
 * @private
 */
const showCursor = () => {
  process.stdout.write('\u001b[?25h');
};

/**
 * Erases the line on stdout
 * @private
 */
const eraseLine = () => {
  process.stdout.write('\u001b[2K');
};
