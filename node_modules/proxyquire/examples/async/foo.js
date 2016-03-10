var fs = require('fs');

module.exports.filesAllCaps = function (dir, cb) { 
  fs.readdir(dir, function (err, files) {
    if (err) cb(err);
    else cb (
        null
      , files.map(function (f) { return f.toUpperCase(); })
      );
  });
};
