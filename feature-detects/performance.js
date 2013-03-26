define(['Modernizr', 'prefixed'], function( Modernizr, prefixed ) {
  // Navigation Timing (Performance)
  // https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/
  // http://www.html5rocks.com/en/tutorials/webperformance/basics/
  // By Scott Murphy (uxder)
  Modernizr.addTest('performance', !!prefixed('performance', window));
});
