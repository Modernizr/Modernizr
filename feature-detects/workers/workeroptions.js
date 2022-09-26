/*!
{
  "name": "Worker options test",
  "property": "workeroptions",
  "tags": ["web worker", "worker options"],
  "builderAliases": ["worker_options"],
  "warnings": ["This test may output garbage to console."],
  "authors": ["Debadutta Panda"],
  "async": true,
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker"
  }]
}
!*/
/* DOC
Detect working status of all Workeroptions
*/
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker
 */
define(['Modernizr', 'addTest'], function (Modernizr, addTest) {
    Modernizr.addAsyncTest(function (){
        const workerOptions={
            type:false,
            credentials:false,
            name:false
        }
        if ('Worker' in window){
            const testOptions = {
                get type() {
                    workerOptions.type = true;
                    return "module";
                },
                get credentials() {
                    workerOptions.credentials = true;
                    return "same-origin";
                },
                get name() {
                    workerOptions.name = true;
                    return "testworker";
                },
            };
            try {
                const worker = new Worker('blob://', testOptions);
                worker.terminate();
            } catch (err) {
                //fallback massage
            } finally {
                addTest("workeroptions", workerOptions);
            }
        }else{
            addTest("workeroptions", workerOptions);
        }
    });
})