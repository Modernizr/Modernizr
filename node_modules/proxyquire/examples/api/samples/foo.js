var stats = require('./stats')
  , bar = require('./bar')
  , path = require('path')
  ;

stats.incFooRequires();

function bigBar () { 
  // inline require
  return require('./bar').bar().toUpperCase();
}

function bigRab () {
  // module wide require
  return bar.rab().toUpperCase();
}

function bigExt (file) {
  return path.extname(file).toUpperCase();
}

function bigBas (file) {
  return path.basename(file).toUpperCase();
}

module.exports = {
    bigBar: bigBar
  , bigRab: bigRab
  , bigExt: bigExt
  , bigBas: bigBas
};
