/*!
{
  "name": "datalist Element",
  "caniuse": "datalist",
  "property": "datalistelem",
  "tags": ["elem"],
  "warnings": ["This test is a dupe of Modernizr.input.list. Only around for legacy reasons."],
  "notes": [{
    "name": "CSS Tricks Article",
    "href": "http://css-tricks.com/15346-relevant-dropdowns-polyfill-for-datalist/"
  },{
    "name": "Mike Taylor Test",
    "href": "http://miketaylr.com/test/datalist.html"
  },{
    "name": "Mike Taylor Code",
    "href": "http://miketaylr.com/code/datalist.html"
  }]
}
!*/
define(['Modernizr', 'test/input'], function( Modernizr ) {
  // lol. we already have a test for datalist built in! silly you.
  // Leaving it around in case anyone's using it

  Modernizr.addTest('datalistelem', Modernizr.input.list );
});
