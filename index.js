'use strict';
var numberIsNan = require('number-is-nan');

function createArg(key, val) {
	key = key.replace(/[A-Z]/g, '-$&').toLowerCase();
	return '--' + key + (val ? '=' + val : '');
}

function match(arr, value) {
	return arr.some(function (toMatch) {
		return toMatch instanceof RegExp ?
			toMatch.test(value) :
			toMatch === value;
	});
}

module.exports = function (input, opts) {
	var args = [];

	opts = opts || {};

	Object.keys(input).forEach(function (key) {
		var val = input[key];

		if (Array.isArray(opts.excludes) && match(opts.excludes, key)) {
			return;
		}

		if (Array.isArray(opts.includes) && !match(opts.includes, key)) {
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
			args.push(createArg(key, String(val)));
		}

		if (Array.isArray(val)) {
			val.forEach(function (arrVal) {
				args.push(createArg(key, arrVal));
			});
		}
	});

	return args;
};
