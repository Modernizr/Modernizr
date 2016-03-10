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
    this.exec(subFlow, 'file1', this.async(as(1)));
    this.exec(subFlow, 'file2', this.async(as(1)));
  },
  function end(data1, data2) {
    if (this.err) throw this.err;
    console.log(data1 + data2);
    console.log('done');
    this.next();
  }
);

mainFlow();