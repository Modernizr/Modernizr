/*!
{
  "name": "CSS Media Queries",
  "caniuse": "",X
  "property": "mediaqueries",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'mq'], function( Modernizr, mq ) {
  Modernizr.addTest('mediaqueries', mq('only all'));
});
