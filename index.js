'use strict';
var numberIsNan = require('number-is-nan');
var minimatch = require('minimatch');

function createArg(key, val) {
	key = key.replace(/[A-Z]/g, '-$&').toLowerCase();
	return '--' + key + (val ? '=' + val : '');
};

function globMatch(globs, value){
	return globs.some(function(glob) {
		return minimatch(value, glob);
	});
}

module.exports = function (input, opts) {
	var args = [];

	opts = opts || {};

	Object.keys(input).forEach(function (key) {
		var val = input[key];

		if (Array.isArray(opts.excludes) && globMatch(opts.excludes, key)) {
			return;
		}

		if (Array.isArray(opts.includes) && !globMatch(opts.includes, key)) {
			return;
		}

		if (val === true) {
			args.push(createArg(key));
		}

		if (val === false && !opts.ignoreFalse) {
			args.push(createArg('no-' + key));
		}

		if (typeof val === 'string') {
			args.push(createArg(key, val));
		}

		if (typeof val === 'number' && !numberIsNan(val)) {
			args.push(createArg(key, '' + val));
		}

		if (Array.isArray(val)) {
			val.forEach(function (arrVal) {
				args.push(createArg(key, arrVal));
			});
		}
	});

	return args;
};
