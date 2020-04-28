import docElement from './docElement.js';
import isBrowser from './isBrowser.js';
import isSVG from './isSVG.js';
import is from './is.js';

var tests = [];

/**
 * Run through all tests and detect their support in the current UA.
 *
 * @access private
 * @returns {void}
 */
function testRunner() {
  var featureNames;
  var feature;
  var aliasIdx;
  var result;
  var nameIdx;
  var featureName;
  var featureNameSplit;

  for (var i = 0; i < tests.length; i++) {
    featureNames = [];
    feature = tests[i];
    // run the test, throw the return value into the Modernizr,
    // then based on that boolean, define an appropriate className
    // and push it into an array of classes we'll join later.
    //
    // If there is no name, it's an 'async' test that is run,
    // but not directly added to the object. That should
    // be done with a post-run addTest call.

    if (feature.name) {
      featureNames.push(feature.name.toLowerCase());

      if (feature.options && feature.options.aliases && feature.options.aliases.length) {
        // Add all the aliases into the names list
        for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
          featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
        }
      }
    }

    // Run the test, or use the raw value if it's not a function
    result = is(feature.fn, 'function') ? isBrowser && feature.fn() : feature.fn;

    // Set each of the names on the Modernizr object
    for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
      // Support dot properties as sub tests. We don't do checking to make sure
      // that the implied parent tests have been added. You must call them in
      // order (either in the test, or make the parent test a dependency).
      //
      // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
      // hashtag famous last words
      featureName = featureNames[nameIdx];
      featureNameSplit = featureName.split('.');
      addTestResult(featureNameSplit, result);
    }
  }
}

/**
 * setClasses takes an array of class names and adds them to the root element
 *
 * @access private
 * @function setClasses
 * @param {string[]} classes - Array of class names
 */
// Pass in an and array of class names, e.g.:
//  ['no-webp', 'borderradius', ...]
function setClasses(classes) {

  var className = docElement.className;
  var classPrefix = Modernizr._config.classPrefix || '';

  if (isSVG) {
    className = className.baseVal;
  }

  // Change `no-js` to `js` (independently of the `enableClasses` option)
  // Handle classPrefix on this too
  if (Modernizr._config.enableJSClass) {
    var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
    className = className.replace(reJS, '$1' + classPrefix + 'js$2');
  }

  if (Modernizr._config.enableClasses) {
    // Add the new classes
    if (classes.length > 0) {
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
    }
    if (isSVG) {
      docElement.className.baseVal = className;
    } else {
      docElement.className = className;
    }
  }
}

var tester = function(async) {
  return function (name, fn, options) {
    tests.push({
      name: async ? null : name,
      fn: async ? name : fn,
      options: async ? null :options
    });

    for (var i = 0; i < Modernizr._q.length; i++) {
      Modernizr._q[i]();
    }
  };
}


/**
 * ModernizrProto is the constructor for Modernizr
 *
 * @class
 * @access public
 */
var ModernizrProto = {
  // The current version, dummy
  _version: "__VERSION__",
  // Queue of tests
  _q: [],
  // Any settings that don't work as separate modules
  //     // can go in here as configuration.
  //
  _config: {
    'classPrefix': '',
    'enableClasses': true,
    'enableJSClass': true,
    'usePrefixes': true
  },
  addTest: tester(),
  addAsyncTest: tester(true)
};

var Modernizr = function () {};

Modernizr.prototype = ModernizrProto;
Modernizr = new Modernizr();

// _l tracks listeners for async tests, as well as tests that execute after the initial run
ModernizrProto._l = {};

/**
 * Modernizr.on is a way to listen for the completion of async tests. Being
 * asynchronous, they may not finish before your scripts run. As a result you
 * will get a possibly false negative `undefined` value.
 *
 * @memberOf Modernizr
 * @name Modernizr.on
 * @access public
 * @function on
 * @param {string} feature - String name of the feature detect
 * @param {Function} cb - Callback function returning a Boolean - true if feature is supported, false if not
 * @returns {void}
 * @example
 *
 * ```js
 * Modernizr.on('flash', function( result ) {
 *   if (result) {
 *    // the browser has flash
 *   } else {
 *     // the browser does not have flash
 *   }
 * });
 * ```
 */
ModernizrProto.on = function (feature, cb) {
  // Create the list of listeners if it doesn't exist
  if (!this._l[feature]) {
    this._l[feature] = [];
  }

  // Push this test on to the listener list
  this._l[feature].push(cb);

  // If it's already been resolved, trigger it on next tick
  if (Modernizr.hasOwnProperty(feature)) {
    setTimeout(function () {
      Modernizr._trigger(feature, Modernizr[feature]);
    }, 0);
  }
};

/**
 * _trigger is the private function used to signal test completion and run any
 * callbacks registered through [Modernizr.on](#modernizr-on)
 *
 * @memberOf Modernizr
 * @name Modernizr._trigger
 * @access private
 * @function _trigger
 * @param {string} feature - string name of the feature detect
 * @param {Function|boolean} [res] - A feature detection function, or the boolean =
 * result of a feature detection function
 * @returns {void}
 */
ModernizrProto._trigger = function (feature, res) {
  if (!this._l[feature]) {
    return;
  }

  var cbs = this._l[feature];

  // Force async
  setTimeout(function () {
    var i, cb;

    for (i = 0; i < cbs.length; i++) {
      cb = cbs[i];
      cb(res);
    }
  }, 0);

  // Don't trigger these again
  delete this._l[feature];
};

/**
 * addTest allows you to define your own feature detects that are not currently
 * included in Modernizr (under the covers it's the exact same code Modernizr
 * uses for its own [feature detections](https://github.com/Modernizr/Modernizr/tree/master/feature-detects)).
 * Just like the official detects, the result
 * will be added onto the Modernizr object, as well as an appropriate className set on
 * the html element when configured to do so
 *
 * @memberOf Modernizr
 * @name Modernizr.addTest
 * @optionName Modernizr.addTest()
 * @optionProp addTest
 * @access public
 * @function addTest
 * @param {string|object} feature - The string name of the feature detect, or an
 * object of feature detect names and test
 * @param {Function|boolean} test - Function returning true if feature is supported,
 * false if not. Otherwise a boolean representing the results of a feature detection
 * @returns {object} the Modernizr object to allow chaining
 * @example
 *
 * The most common way of creating your own feature detects is by calling
 * `Modernizr.addTest` with a string (preferably just lowercase, without any
 * punctuation), and a function you want executed that will return a boolean result
 *
 * ```js
 * Modernizr.addTest('itsTuesday', function() {
 *  var d = new Date();
 *  return d.getDay() === 2;
 * });
 * ```
 *
 * When the above is run, it will set Modernizr.itstuesday to `true` when it is tuesday,
 * and to `false` every other day of the week. One thing to notice is that the names of
 * feature detect functions are always lowercased when added to the Modernizr object. That
 * means that `Modernizr.itsTuesday` will not exist, but `Modernizr.itstuesday` will.
 *
 *
 *  Since we only look at the returned value from any feature detection function,
 *  you do not need to actually use a function. For simple detections, just passing
 *  in a statement that will return a boolean value works just fine.
 *
 * ```js
 * Modernizr.addTest('hasjquery', 'jQuery' in window);
 * ```
 *
 * Just like before, when the above runs `Modernizr.hasjquery` will be true if
 * jQuery has been included on the page. Not using a function saves a small amount
 * of overhead for the browser, as well as making your code much more readable.
 *
 * Finally, you also have the ability to pass in an object of feature names and
 * their tests. This is handy if you want to add multiple detections in one go.
 * The keys should always be a string, and the value can be either a boolean or
 * function that returns a boolean.
 *
 * ```js
 * var detects = {
 *  'hasjquery': 'jQuery' in window,
 *  'itstuesday': function() {
 *    var d = new Date();
 *    return d.getDay() === 2;
 *  }
 * }
 *
 * Modernizr.addTest(detects);
 * ```
 *
 * There is really no difference between the first methods and this one, it is
 * just a convenience to let you write more readable code.
 */
function addTest(feature, test) {
  if (typeof feature === 'object') {
    for (var key in feature) {
      if (feature.hasOwnProperty(key)) {
        addTest(key, feature[key]);
      }
    }
  } else {
    feature = feature.toLowerCase();
    var featureNameSplit = feature.split('.');
    var last = Modernizr[featureNameSplit[0]];

    // Again, we don't check for parent test existence. Get that right, though.
    if (featureNameSplit.length === 2) {
      last = last[featureNameSplit[1]];
    }

    if (typeof last !== 'undefined') {
      // we're going to quit if you're trying to overwrite an existing test
      // if we were to allow it, we'd do this:
      //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
      //   docElement.className = docElement.className.replace( re, '' );
      // but, no rly, stuff 'em.
      return Modernizr;
    }

    test = typeof test === 'function' ? isBrowser && test() : test;

    // Set a single class (either `feature` or `no-feature`)
    addTestResult(featureNameSplit, test);

    // Trigger the event
    Modernizr._trigger(feature, test);
  }

  // allow chaining.
  return Modernizr;
}

// After all the tests are run, add self to the Modernizr prototype
Modernizr._q.push(function () {});

function addTestResult(featureNameSplit, result) {

  // Set the value (this is the magic, right here).
  if (featureNameSplit.length === 1) {
    Modernizr[featureNameSplit[0]] = result;
  } else {
    // cast to a Boolean, if not one already
    if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
      Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
    }

    Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
  }

  setClasses([(result ? '' : 'no-') + featureNameSplit.join('-')]);
}

function createAsyncTestListener(feature) {
  return function (cb) {
    if (typeof cb === "function") {
      Modernizr.on(feature, cb);
      return;
    }

    return new Promise(function (resolve) {
      Modernizr.on(feature, resolve);
    });
  };
}

export default Modernizr;
export { ModernizrProto, addTest, createAsyncTestListener, setClasses, testRunner, tester, tests };

