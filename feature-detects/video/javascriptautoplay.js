/*!
 {
 "name": "Video Javascript Autoplay",
 "property": "videojavascriptautoplay",
 "tags": ["video"],
 "async" : true,
 "warnings": ["This test is very large – only include it if you absolutely need it"],
 "knownBugs": ["crashes with an alert on iOS7 when added to homescreen"]
 }
 !*/
/* DOC
 Checks for support of javascript initiated auto play for the video element.
 */
define(['Modernizr', 'addTest', 'playVideoTestBuilder', 'test/video'], function ( Modernizr, addTest, playVideoTestBuilder ) {

  Modernizr.addAsyncTest(function () {
    var playVideoTest = playVideoTestBuilder(function ( elem ) {
      elem.play();
    });

    playVideoTest(function ( result ) {
      addTest('videojavascriptautoplay', result);
    });
  });
});
