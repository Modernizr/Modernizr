var flow = require('../index').flow;
var as = require('../index').as;
var fs = require('fs');

var myFlow = flow('myFlow')(
  function readFiles(file1, file2) {
    fs.readFile(file1, 'utf8', this.async(as(1)));
    fs.readFile(file2, 'utf8', this.async(as(1)));
  },
  function concat(data1, data2) {
    this.next(data1 + data2);
  },
  function end(data) {
    if (this.err) {
      // handle error
      console.log(this.err.message);
      // indicate error handling completion
      this.err = null;
    } else {
      console.log(data);
    }
    console.log('done');
    this.next();
  }
);

myFlow('file1', 'non-existent-file');