var parse = require('jsdoc-parse');
var _ = require('lodash');
var jsonOptions;


function options(cb) {

  cb = cb || Function.prototype;

  if (jsonOptions) {
    cb(jsonOptions);
    return jsonOptions;
  }

  var results = '';

  var parsedResults = parse({src: __dirname + '/../src/*.js'});

  parsedResults.on('data', function(chunk) {
    results += chunk;
  });

  parsedResults.on('finish', function() {
    results = _.chain(JSON.parse(results))
      .filter(function(result) {
        return 'customTags' in result;
      })
      .map(function(result) {
        return result.customTags;
      })
      .map(function(result) {
        return {
          name: _.where(result, {tag: 'optionname'})[0].value,
          property: _.where(result, {tag: 'optionprop'})[0].value
        };
      })
      .value();

      jsonOptions = results;

      cb(results);
  });
}

module.exports = options;
