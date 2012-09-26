
// Note, Android < 4 will pass this test, but can only animate
//   a single property at a time
//   daneden.me/2011/12/putting-up-with-androids-bullshit/
Modernizr.addTest('cssanimations', function() {
    return Modernizr.testAllProps('animationName');
});
