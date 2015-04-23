/*!
{
  "name": "Hidden Scrollbar",
  "property": "hiddenscroll",
  "authors": ["Oleg Korsunsky"]
}
!*/
/* DOC
Detects whether scrollbars on overflowed blocks are hidden (a-la iPhone)
*/
define(['Modernizr', 'testStyles'], function(Modernizr, testStyles) {
  Modernizr.addTest('hiddenscroll', function() {
    return testStyles('#modernizr {width:100px;height:100px;overflow:scroll}', function(elem) {
      return elem.offsetWidth === elem.clientWidth;
    });
  });
});
