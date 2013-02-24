/*!
{
  "name": "a[download] Attribute",
  "property": "adownload",
  "aliases": [],
  "tags": ["media"],
  "doc": null,
  "knownBugs": [],
  "authors": [],
  "warnings": [],
  "notes": [{
    "name": "WhatWG Reference",
    "href": "http://developers.whatwg.org/links.html#downloading-resources"
  }]
}
!*/
define(['Modernizr', 'createElement'], function( Modernizr, createElement ) {
  // a[download] attribute
  // When used on an <a>, this attribute signifies that the resource it
  // points to should be downloaded by the browser rather than navigating to it.

  Modernizr.addTest('adownload', 'download' in createElement('a'));
});
