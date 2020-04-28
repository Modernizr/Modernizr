/*!
{
  "name": "progress Element",
  "caniuse": "progress",
  "property": ["progressbar", "meter"],
  "tags": ["elem"],
  "builderAliases": ["elem_progress_meter"],
  "authors": ["Stefan Wallin"]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';

var results = {
  'progressbar': createElement('progress').max !== undefined,
  'meter': createElement('meter').max !== undefined
}

// Tests for progressbar-support. All browsers that don't support progressbar returns undefined =)
Modernizr.addTest('progressbar', results.progressbar);

// Tests for meter-support. All browsers that don't support meters returns undefined =)
Modernizr.addTest('meter', results.meter);

export default results
