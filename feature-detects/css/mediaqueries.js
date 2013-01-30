define(['Modernizr', 'mq'], function( Modernizr, mq ) {
  Modernizr.addTest('mediaqueries', mq('only all'));
});
