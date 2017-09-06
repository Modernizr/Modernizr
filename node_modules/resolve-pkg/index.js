'use strict';
var path = require('path');
var resolveFrom = require('resolve-from');

module.exports = function (moduleId, opts) {
	opts = opts || {};

	var parts = moduleId.split(path.sep);
	var pkg = path.join(parts.shift(), 'package.json');
	var resolved = resolveFrom(opts.cwd || '.', pkg);

	if (!resolved) {
		return null;
	}

	return path.join(path.dirname(resolved), parts.join(path.sep));
};
