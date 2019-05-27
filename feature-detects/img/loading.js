/*!
{
  "name": "image and iframe native lazy loading",
  "property": "lazyloading",
  "caniuse": "loading-lazy-attr",
  "tags": ["image", "lazy", "loading"],
  "notes": [{
    "name": "Native image lazy-loading for the web",
    "href": "https://addyosmani.com/blog/lazy-loading/"
  }]
}
!*/
/* DOC
Test for the loading attribute of images and iframes
*/

define(['Modernizr'], function (Modernizr) {
  Modernizr.addTest('lazyloading', 'loading' in HTMLImageElement.prototype);
});
