var flow = require('../index').flow;

flow('mainFlow')(
  function step1() {
    console.log(this.stepName);
    this.next();
  },
  flow('subFlow')(
    function subStep1() {
      console.log(this.stepName);
      this.next();
    },
    function subStep2() {
      console.log(this.stepName);
      this.next();
    },
    function subStep3() {
      console.log(this.stepName);
      throw new Error('hoge');
    }
  ),
  function step2() {
    console.log(this.stepName);
    this.next();
  },
  function step3() {
    if (this.err) {
      console.log(this.stepName);
      this.err = null;
    }
    console.log('done');
    this.next();
  }
)();
