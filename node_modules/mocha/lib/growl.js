'use strict';

/**
 * Desktop Notifications module.
 * @module Growl
 */

const os = require('os');
const path = require('path');
const {sync: which} = require('which');
const {EVENT_RUN_END} = require('./runner').constants;

/**
 * @summary
 * Checks if Growl notification support seems likely.
 *
 * @description
 * Glosses over the distinction between an unsupported platform
 * and one that lacks prerequisite software installations.
 *
 * @public
 * @see {@link https://github.com/tj/node-growl/blob/master/README.md|Prerequisite Installs}
 * @see {@link Mocha#growl}
 * @see {@link Mocha#isGrowlCapable}
 * @return {boolean} whether Growl notification support can be expected
 */
exports.isCapable = () => {
  if (!process.browser) {
    return getSupportBinaries().reduce(
      (acc, binary) => acc || Boolean(which(binary, {nothrow: true})),
      false
    );
  }
  return false;
};

/**
 * Implements desktop notifications as a pseudo-reporter.
 *
 * @public
 * @see {@link Mocha#_growl}
 * @param {Runner} runner - Runner instance.
 */
exports.notify = runner => {
  runner.once(EVENT_RUN_END, () => {
    display(runner);
  });
};

/**
 * Displays the notification.
 *
 * @private
 * @param {Runner} runner - Runner instance.
 */
const display = runner => {
  const growl = require('growl');
  const stats = runner.stats;
  const symbol = {
    cross: '\u274C',
    tick: '\u2705'
  };
  let _message;
  let message;
  let title;

  if (stats.failures) {
    _message = `${stats.failures} of ${stats.tests} tests failed`;
    message = `${symbol.cross} ${_message}`;
    title = 'Failed';
  } else {
    _message = `${stats.passes} tests passed in ${stats.duration}ms`;
    message = `${symbol.tick} ${_message}`;
    title = 'Passed';
  }

  // Send notification
  const options = {
    image: logo(),
    name: 'mocha',
    title
  };
  growl(message, options, onCompletion);
};

/**
 * @summary
 * Callback for result of attempted Growl notification.
 *
 * @description
 * Despite its appearance, this is <strong>not</strong> an Error-first
 * callback -- all parameters are populated regardless of success.
 *
 * @private
 * @callback Growl~growlCB
 * @param {*} err - Error object, or <code>null</code> if successful.
 */
function onCompletion(err) {
  if (err) {
    // As notifications are tangential to our purpose, just log the error.
    const message =
      err.code === 'ENOENT' ? 'prerequisite software not found' : err.message;
    console.error('notification error:', message);
  }
}

/**
 * Returns Mocha logo image path.
 *
 * @private
 * @return {string} Pathname of Mocha logo
 */
const logo = () => {
  return path.join(__dirname, '..', 'assets', 'mocha-logo-96.png');
};

/**
 * @summary
 * Gets platform-specific Growl support binaries.
 *
 * @description
 * Somewhat brittle dependency on `growl` package implementation, but it
 * rarely changes.
 *
 * @private
 * @see {@link https://github.com/tj/node-growl/blob/master/lib/growl.js#L28-L126|setupCmd}
 * @return {string[]} names of Growl support binaries
 */
const getSupportBinaries = () => {
  const binaries = {
    Darwin: ['terminal-notifier', 'growlnotify'],
    Linux: ['notify-send', 'growl'],
    Windows_NT: ['growlnotify.exe']
  };
  return binaries[os.type()] || [];
};
