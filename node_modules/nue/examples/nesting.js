var flow = require('../index').flow;
var as = require('../index').as;
var fs = require('fs');

var subFlow = flow('subFlow')(
  function readFile(file) {
    fs.readFile(file, 'utf8', this.async(as(1)));
  }
);

var mainFlow = flow('mainFlow')(
  function start() {
    this.next('file1');
  },
  subFlow,
  function end(result) {
    if (this.err) throw this.err;
    console.log(result);
    console.log('done');
    this.next();
  }
);

mainFlow();