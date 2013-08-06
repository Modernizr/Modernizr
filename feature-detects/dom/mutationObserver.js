/*!
{
  "name": "DOM4 MutationObserver",
  "property": "mutationobserver",
  "caniuse": "mutationobserver",
  "tags": ["dom"],
  "authors": ["Karel Sedláček"]
}
!*/
define(['Modernizr'], function( Modernizr ) {
  Modernizr.addTest('mutationobserver',
    !!window.MutationObserver || !!window.WebKitMutationObserver);
});
