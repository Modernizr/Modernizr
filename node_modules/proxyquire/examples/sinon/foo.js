var fs = require('fs')
  , path = require('path');

module.exports.filesAllCaps = function (dir, cb) { 
  fs.readdir(dir, function (err, files) {
    if (err) cb(err);
    else cb (
        null
      , files.map(function (f) { return f.toUpperCase(); })
      );
  });
};

module.exports.extnameAllCaps = function (file) { 
  return path.extname(file).toUpperCase();
};

