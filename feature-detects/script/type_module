/*!
{
  "name": "script[type]",
  "property": "scripttype",
  "caniuse": "script-type-module",
  "tags": ["script"],
  "builderAliases": ["script_type_module"],
  "authors": ["Frank Lemanschik"]
  "notes": [{
     "name": "The ES6 Dynamic Import spec",
     "href": "https://tc39.github.io/ecma262/#sec-modules"
   }]
}
!*/
/* DOC
 Check if browser implements Script Type Module aka ES6 Module Specification.
*/
Modernizr.addTest('es6module', function(){
   return 'noModule' in document.createElement('script')
});
