/*!
{
  "name": "CSS Media Queries",
  "caniuse": "css-mediaqueries",
  "property": "mediaqueries",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'mq'], function( Modernizr, mq ) {
  Modernizr.addTest('mediaqueries', mq('only all'));
});
