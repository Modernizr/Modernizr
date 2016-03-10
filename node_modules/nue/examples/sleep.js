var flow = require('../index').flow;
var as = require('../index').as;

function sleep(ms) {
  setTimeout(this.async(as(-1)), ms);
}

flow('myFlow')(
  function start() {
    console.log('wait... ' + new Date());
    this.exec(sleep, 1000, this.async(as(1)));
  },
  function end() {
    if (this.err) throw this.err;
    console.log('ok... ' + new Date());
    this.next();
  }
)();

console.log('back in main');
