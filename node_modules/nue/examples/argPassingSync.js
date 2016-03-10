var flow = require('../index').flow;

var myFlow = flow('myFlow')(
  function concat(s1, s2) {
    var length = s1.length + s2.length
    this.next(s1, s2, length);
  },
  function end(s1, s2, length) {
    if (this.err) throw this.err;
    console.log(s1 + '.length + ' + s2 + '.length -> ' + length); // file1.length + file2.length -> 10
    console.log('done');
    this.next();
  }
);

myFlow('file1', 'file2');