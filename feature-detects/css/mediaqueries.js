/*!
{
  "name": "CSS Media Queries",
  "caniuse": "css-mediaqueries",
  "property": "mediaqueries",
  "tags": ["css"],
  "builderAliases": ["css_mediaqueries"]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import mq from '../../src/mq.js';

Modernizr.addTest('mediaqueries', mq('only all'));

export default Modernizr.mediaqueries
