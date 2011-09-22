/*!
 * Modernizr.serialize v1.0
 * Created by Baris Aydinoglu
 * http://baris.aydinoglu.info
 */

/*
 * Modernizr.Serialize plugin serializes the Modernizr features as JSON.
 * There is an option to select only true variables in the serialized 
 * JSON object, called onlyTrueVariables.
 * 
 * The other parameters are replacer and space, and they used for 
 * passing to JSON.stringify.
 * Replacer is a function or array that filters and transforms the results.
 * Space adds indentation, white space, and line break characters to the 
 * return-value JSON text to make it easier to read.
 */

Modernizr.serialize = function (onlyTrueVariables, replacer, space) {
  function filterTrueVariables(object) {
		var replacement = replacement || new Object();
		if ( !! object) {
			for (var val in object) {
				var typeOfObject = Object.prototype.toString.apply(object[val]);
				if (typeOfObject === '[object Boolean]') {
					if ( !! object[val]) {
						replacement[val] = object[val];
					}
				} else if (typeOfObject === '[object Object]') {
					replacement[val] = filterTrueVariables(object[val]);
				}
			}
		}
		return replacement;
	}
	Modernizr.toJSON = function (key) {
		return ( !! onlyTrueVariables) ? filterTrueVariables(this) : this;
	};
	return JSON.stringify(Modernizr, replacer, space);
};