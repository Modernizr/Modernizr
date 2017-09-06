var flow = require('../index').flow;
var parallel = require('../index').parallel;

var myFlow = flow('main')(
  function one() {
    console.log(this.stepName);
    this.next(); 
  },
  function two() {
    console.log(this.stepName);
    this.next(); 
  },
  parallel('par1')(
    flow('par1-1')(
      function three() {
        console.log(this.stepName);
        this.next(); 
      },
      function four() {
        console.log(this.stepName);
        this.next(); 
      }
    ),
    flow('par1-2')(
      function five() {
        console.log(this.stepName);
        this.next(); 
      },
      function six() {
        console.log(this.stepName);
        this.next(); 
      }
    )
  ),
  function seven() {
    console.log(this.stepName);
    this.next(); 
  },
  function eight() {
    console.log(this.stepName);
    this.next(); 
  },
  function allDone() {
    if (this.err) throw this.err;
    console.log(this.stepName);
    this.next();
  }
);

myFlow();