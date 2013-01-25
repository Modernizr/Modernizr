define(['Modernizr', 'testStyles'], function( Modernizr, testStyles ) {
  // last-child pseudo selector
  // https://github.com/Modernizr/Modernizr/pull/304
  testStyles("#modernizr div {width:100px} #modernizr :last-child{width:200px;display:block}", function( elem ) {
    Modernizr.addTest('lastchild', elem.lastChild.offsetWidth > elem.firstChild.offsetWidth);
  }, 2);
});
