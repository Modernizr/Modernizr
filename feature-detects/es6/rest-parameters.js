/*!
{
  "name": "ES6 Rest parameters",
  "property": "restparameters",
  "authors": ["dabretin"],
  "tags": ["es6"]
}
!*/
/* DOC
Check if browser implements ECMAScript 6 Rest parameters per specification.
*/
define(['Modernizr'], function(Modernizr) {
	Modernizr.addTest('restparameters', function() {
		try {
			// eslint-disable-next-line
			eval('function f(...rest) {}');
		} catch (e) {
			return false;
		}
		return true;
	});
});
