/*!
{
  "name": "image native lazy loading",
  "property": "loading",
  "caniuse": "loading",
  "tags": ["image", "lazy", "loading"],
  "notes": [{
    "name": "Native image lazy-loading for the web",
    "href": "https://addyosmani.com/blog/lazy-loading/"
  }]
}
!*/
/* DOC
Test for the loading attribute of images
*/

define(['Modernizr'], function (Modernizr) {
  Modernizr.addTest('lazyloading', 'loading' in HTMLImageElement.prototype);
});
