/*!
{
  "name": "DOM4 MutationObserver",
  "property": "mutationObserver",
  "caniuse": "mutationobserver",
  "tags": ["dom"],
  "authors": ["Karel Sedláček"]
}
!*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('mutationObserver',
    !!window.MutationObserver || !!window.WebKitMutationObserver);
});
