/* globals mocha, __coverage__ */
$(document).ready(function() {
  var runner = mocha.run();

  var failedTests = [];

  runner.once('suite', function() {
    mocha.suite.afterAll('send coverage', function(done) {
    window.mochaResults = runner.stats;
    window.mochaResults.reports = failedTests;

    if (window.__coverage__) {
      $.ajax({
        type: 'POST',
        url: '/coverage/client',
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

    var flattenTitles = function(test) {
      var titles = [];
      while (test.parent.title) {
        titles.push(test.parent.title);
        test = test.parent;
      }
      return titles.reverse();
    };

    failedTests.push({
      name: test.title,
      result: false,
      message: err.message,
      stack: err.stack,
      titles: flattenTitles(test)
    });
  }
});

