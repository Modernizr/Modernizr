var fs = require('fs');

var requirejs = require('requirejs');
var mkdirp = require('mkdirp');
var argv = require('optimist').argv;

if (!argv._ || !argv._.length) {
  console.error('Error: Generation requires a config file.');
  process.exit(1);
}

var config = require(__dirname + '/../' + argv._[0]);

requirejs.config({
  baseUrl : __dirname + '/../',
  appDir : __dirname + '/../'
});

requirejs(['src/generate'], function( generate ) {
  // Generate the initial file as a string
  var initCode = generate(config);

  // Write the string to a temporary directory
  var dir = __dirname + '/../tmp/';
  mkdirp(dir, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    fs.writeFileSync(dir + 'modernizr-init.js', initCode);
  });
});
