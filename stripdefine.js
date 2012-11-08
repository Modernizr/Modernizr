var fs = require('fs');

var mod = fs.readFileSync(__dirname + '/dist/modernizr-build.js', 'utf8');

mod = mod.replace('define("modernizr-init", function(){});', '');
fs.writeFileSync(__dirname + '/dist/modernizr-build.js', ";(function(window, document, undefined){\n" + mod + "\n})(this, document);", 'utf8');
