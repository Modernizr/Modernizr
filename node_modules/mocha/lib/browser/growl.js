'use strict';

/**
 * Web Notifications module.
 * @module Growl
 */

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */
var Date = global.Date;
var setTimeout = global.setTimeout;
var EVENT_RUN_END = require('../runner').constants.EVENT_RUN_END;

/**
 * Checks if browser notification support exists.
 *
 * @public
 * @see {@link https://caniuse.com/#feat=notifications|Browser support (notifications)}
 * @see {@link https://caniuse.com/#feat=promises|Browser support (promises)}
 * @see {@link Mocha#growl}
 * @see {@link Mocha#isGrowlCapable}
 * @return {boolean} whether browser notification support exists
 */
exports.isCapable = function() {
  var hasNotificationSupport = 'Notification' in window;
  var hasPromiseSupport = typeof Promise === 'function';
  return process.browser && hasNotificationSupport && hasPromiseSupport;
};

/**
 * Implements browser notifications as a pseudo-reporter.
 *
 * @public
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/notification|Notification API}
 * @see {@link https://developers.google.com/web/fundamentals/push-notifications/display-a-notification|Displaying a Notification}
 * @see {@link Growl#isPermitted}
 * @see {@link Mocha#_growl}
 * @param {Runner} runner - Runner instance.
 */
exports.notify = function(runner) {
  var promise = isPermitted();

  /**
   * Attempt notification.
   */
  var sendNotification = function() {
    // If user hasn't responded yet... "No notification for you!" (Seinfeld)
    Promise.race([promise, Promise.resolve(undefined)])
      .then(canNotify)
      .then(function() {
        display(runner);
      })
      .catch(notPermitted);
  };

  runner.once(EVENT_RUN_END, sendNotification);
};

/**
 * Checks if browser notification is permitted by user.
 *
 * @private
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Notification/permission|Notification.permission}
 * @see {@link Mocha#growl}
 * @see {@link Mocha#isGrowlPermitted}
 * @returns {Promise<boolean>} promise determining if browser notification
 *     permissible when fulfilled.
 */
function isPermitted() {
  var permitted = {
    granted: function allow() {
      return Promise.resolve(true);
    },
    denied: function deny() {
      return Promise.resolve(false);
    },
    default: function ask() {
      return Notification.requestPermission().then(function(permission) {
        return permission === 'granted';
      });
    }
  };

  return permitted[Notification.permission]();
}

/**
 * @summary
 * Determines if notification should proceed.
 *
 * @description
 * Notification shall <strong>not</strong> proceed unless `value` is true.
 *
 * `value` will equal one of:
 * <ul>
 *   <li><code>true</code> (from `isPermitted`)</li>
 *   <li><code>false</code> (from `isPermitted`)</li>
 *   <li><code>undefined</code> (from `Promise.race`)</li>
 * </ul>
 *
 * @private
 * @param {boolean|undefined} value - Determines if notification permissible.
 * @returns {Promise<undefined>} Notification can proceed
 */
function canNotify(value) {
  if (!value) {
    var why = value === false ? 'blocked' : 'unacknowledged';
    var reason = 'not permitted by user (' + why + ')';
    return Promise.reject(new Error(reason));
  }
  return Promise.resolve();
}

/**
 * Displays the notification.
 *
 * @private
 * @param {Runner} runner - Runner instance.
 */
function display(runner) {
  var stats = runner.stats;
  var symbol = {
    cross: '\u274C',
    tick: '\u2705'
  };
  var logo = require('../../package').notifyLogo;
  var _message;
  var message;
  var title;

  if (stats.failures) {
    _message = stats.failures + ' of ' + stats.tests + ' tests failed';
    message = symbol.cross + ' ' + _message;
    title = 'Failed';
  } else {
    _message = stats.passes + ' tests passed in ' + stats.duration + 'ms';
    message = symbol.tick + ' ' + _message;
    title = 'Passed';
  }

  // Send notification
  var options = {
    badge: logo,
    body: message,
    dir: 'ltr',
    icon: logo,
    lang: 'en-US',
    name: 'mocha',
    requireInteraction: false,
    timestamp: Date.now()
  };
  var notification = new Notification(title, options);

  // Autoclose after brief delay (makes various browsers act same)
  var FORCE_DURATION = 4000;
  setTimeout(notification.close.bind(notification), FORCE_DURATION);
}

/**
 * As notifications are tangential to our purpose, just log the error.
 *
 * @private
 * @param {Error} err - Why notification didn't happen.
 */
function notPermitted(err) {
  console.error('notification error:', err.message);
}
