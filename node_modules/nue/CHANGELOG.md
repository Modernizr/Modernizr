# Changelog

 - 0.6.0 (2012/03/10)
   - New Feature - debugging is supported. `NODE_DEBUG=nue` is available.
   - Change - NueAsyncError is improved. Now NueAsyncError is a plain Error object.
   - Change - `nue.as` arguments is required.  
   - Change - `history` property is removed from the step context.
   - Change - result array from `this.asyncEach` is not flatten. 
   - Change - result array from `nue.parallel` is not flatten. 

 - 0.5.0 (2012/03/04)
   - New Feature - `nue.as` function is introduced to map asynchronous callback arguments to next function ones.
   - Change - in a step function, `this.async` accepts arguments mapping definition to pass callback arguments to a next function.
   - Change - in a step function, `this.forEach` function is removed and `this.asyncEach` is added instead.
   - Change - in a step function, `this.args` property is removed.

 - 0.4.0 (2012/02/27)
   - New Feature - `nue.parallel` is available to execute some steps in parallel.
   - New Feature - in a step function, `this.forEach` function is available to execute a provided function once per array element in parallel.
   - New Feature - in a step function, `this.exec` function is available to execute a step asynchronously.
   - New Feature - in a step function, `this.history` property is available to contain information about executed steps (EXPERIMENTAL).

 - 0.3.0 (2012/02/25)
   - New Feature - in a step function, `this.endWith` is available to end a control-flow with an error.
   - Change - `arguments` for an async callback are grouped by each `this.async` call. 

 - 0.2.0 (2012/02/23)
   - New Feature - an error passed to async callback is notified with NueAsyncError to make debug easy
   - New Feature - an unhandled error is notified with NueUnhandledError to make debug easy
   - New Feature - supported to name a flow
   - New Feature - in a step function, `this.flowName` is available.
   - New Feature - in a step function, `this.stepName` is available.
   - Change - in a step function, `this.end` doesn't accept an error object as first argument. To end a flow with an error, `throw` the error.

 - 0.1.0 (2012/02/21)
   - first release.