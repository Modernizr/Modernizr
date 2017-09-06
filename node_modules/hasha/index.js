'use strict';
var fs = require('fs');
var crypto = require('crypto');
var isStream = require('is-stream');
var Promise = require('pinkie-promise');

var hasha = module.exports = function (input, opts) {
	opts = opts || {};

	var outputEncoding = opts.encoding || 'hex';

	if (outputEncoding === 'buffer') {
		outputEncoding = undefined;
	}

	var hash = crypto.createHash(opts.algorithm || 'sha512');

	var update = function (buf) {
		var inputEncoding = typeof buf === 'string' ? 'utf8' : undefined;
		hash.update(buf, inputEncoding);
	};

	if (Array.isArray(input)) {
		input.forEach(update);
	} else {
		update(input);
	}

	return hash.digest(outputEncoding);
};

hasha.stream = function (opts) {
	opts = opts || {};

	var outputEncoding = opts.encoding || 'hex';

	if (outputEncoding === 'buffer') {
		outputEncoding = undefined;
	}

	var stream = crypto.createHash(opts.algorithm || 'sha512');
	stream.setEncoding(outputEncoding);
	return stream;
};

hasha.fromStream = function (stream, opts) {
	if (!isStream(stream)) {
		return Promise.reject(new TypeError('Expected a stream'));
	}

	opts = opts || {};

	return new Promise(function (resolve, reject) {
		stream
			.on('error', reject)
			.pipe(hasha.stream(opts))
			.on('error', reject)
			.on('finish', function () {
				resolve(this.read());
			});
	});
};

hasha.fromFile = function (fp, opts) {
	return hasha.fromStream(fs.createReadStream(fp), opts);
};

hasha.fromFileSync = function (fp, opts) {
	return hasha(fs.readFileSync(fp), opts);
};
