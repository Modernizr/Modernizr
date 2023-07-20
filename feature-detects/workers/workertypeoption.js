/*!
{
  "name": "worker type option test",
  "property": "workertypeoption",
  "caniuse":"mdn-api_worker_worker_ecmascript_modules",
  "tags": ["web worker type options", "web worker"],
  "builderAliases": ["worker_type_options"],
  "authors": ["Debadutta Panda"],
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker"
  }]
}
!*/
/* DOC
Detect working status of all Workeroptions
https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker
*/
define(['Modernizr'], function (Modernizr) {
    Modernizr.addTest("workertypeoption", function () {
        if ('Worker' in window) {
            var isTypeOptionSupported = false,
                textTypeOption = {
                    get type() {
                        isTypeOptionSupported = true;
                        return "module"
                    }
                },
                scriptText = `var message='hello'`,
                blob = new Blob([scriptText], { type: 'text/javascript' }),
                url = URL.createObjectURL(blob)
            try {
                new Worker(url, textTypeOption).terminate();
                return isTypeOptionSupported;
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    });
});