var fs = require('fs');
var file = require('file');

var viewRoot = file.path.abspath(__dirname + '/feature-detects');
var tests = [];
file.walkSync(viewRoot, function (start, dirs, files) {
  files.forEach(function (file) {
    if ( file === '.DS_Store') {
      return;
    }
    var test = fs.readFileSync(start + '/' + file, 'utf8');
    // TODO :: make this regex not suck
    var matches = test.match(/\/\*\!([^\!\*]*)\!\*\//m);
    var metadata;

    if (matches && matches[1]) {
      try {
        metadata = JSON.parse(matches[1]);
      }
      catch(e) {
        metadata = {};
      }
      console.log();
    }
    else {
      metadata = {};
    }

    metadata.path = (start + '/' + file).replace(__dirname, '');
    metadata.amdPath = metadata.path.replace('/feature-detects', 'test').replace(/\.js$/i, '');

    if (!metadata.name) {
      metadata.name = metadata.amdPath;
    }

    if (!metadata.async) {
      metadata.async = null;
    }

    if (!metadata.cssclass && metadata.property) {
      metadata.cssclass = metadata.property;
    }
    else {
      metadata.cssclass = null;
    }

    if (!metadata.doc) {
      // Maybe catch a bug
      metadata.doc = metadata.docs || null;
    }

    if (!metadata.tags) {
      metadata.tags = [];
    }

    if (!metadata.authors) {
      metadata.authors = [];
    }

    if (!metadata.knownBugs) {
      metadata.knownBugs = [];
    }

    tests.push(metadata);
  });
});

console.log(JSON.stringify(tests, null, "  "));
