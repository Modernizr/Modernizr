/*!
{
  "name": "Filesystem API",
  "property": "filesystem",
  "caniuse": "filesystem",
  "notes": [{
    "name": "W3 Draft",
    "href": "dev.w3.org/2009/dap/file-system/file-dir-sys.html"
  }],
  "authors": ["Eric Bidelman (@ebidel)"],
  "tags": ["file"],
  "knownBugs": ["The API will be present in Chrome incognito, but will throw an exception. See crbug.com/93417"]
}
!*/
define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  Modernizr.addTest('filesystem', !!prefixed('requestFileSystem', window));
});
