define(['Modernizr', 'addTest'], function( Modernizr, addTest ) {
  // SVG in an `<img>` tag
  // Assumes data URI support.
  // This test is asynchronous. Watch out.
  Modernizr.addAsyncTest(function () {
    var img = new Image();

    img.onerror = function () {
      addTest('svgasimg', false);
    };
    img.onload = function () {
      addTest('svgasimg', img.width == 1 && img.height == 1);
    };

    img.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8c3ZnIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+';
  });
});
