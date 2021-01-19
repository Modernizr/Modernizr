/* eslint-disable no-restricted-syntax */
/*globals __coverage__*/
$(document).ready(function() {

  var runner = mocha.run();

  var results = {
    passed: 0,
    failed: 0,
    total: 0,
    tests: []
  };

  runner.once('suite', function() {
    mocha.suite.afterAll('send coverage', function(done) {
      // ensure timeout errors block normal reporting, to ensure the entire suite is retried
      if (!window.global_test_results) {
        // opera 12 can't handle the default `window.mochaResults`, so we build
        // generic test data instead
        window.global_test_results = results;
      }

      if (window.__coverage__) {
        $.ajax({
          type: 'POST',
          url: '/coverage/client',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(__coverage__),
          success: function() {
            done();
          }
        });
      } else {
        done();
      }
    });
  });

  runner.on('fail', logFailure);

  function logFailure(test, err) {
    var isTimeout = err.toString().indexOf('Ensure the done() callback is being called in this test.') > -1;

    if (isTimeout) {
      return window.global_test_results = {message: err};
    }

    if (err) {
      results.failed += 1;
    } else {
      results.passed += 1;
    }

    results.total += 1;

    var flattenTitles = function(test) {
      var titles = [];
      while (test.parent.title) {
        titles.push(test.parent.title);
        test = test.parent;
      }
      return titles.reverse();
    };

    results.tests.push({
      name: test.title,
      result: err ? false : true,
      message: err ? err.message : 'passe',
      stack: err ? err.stack : undefined,
      titles: flattenTitles(test)
    });
  }
});

