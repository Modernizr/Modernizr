var flow = require('../index').flow;
var parallel = require('../index').parallel;

var myFlow = flow('main')(
  function start() {
    this.next(10, 20);
  },
  parallel('parallel')(
    function add(x, y) {
      this.next(x + y);
    },
    function sub(x, y) {
      this.next(x - y);
    }
  ),
  function end(results) {
    if (this.err) throw this.err;
    console.log('add result: ' + results[0]); // add result: 30 
    console.log('sub result: ' + results[1]); // sub result: -10
    this.next();
  }
);

myFlow();