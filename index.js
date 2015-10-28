'use strict';
var numberIsNan = require('number-is-nan');

function createArg(key, val) {
	key = key.replace(/[A-Z]/g, '-$&').toLowerCase();
	return '--' + key + (val ? '=' + val : '');
};

module.exports = function (input, opts) {
	var args = [];

	opts = opts || {};

	Object.keys(input).forEach(function (key) {
		var val = input[key];

		if (key === '_') {
			return;
		}

		if (Array.isArray(opts.excludes) && opts.excludes.indexOf(key) !== -1) {
			return;
		}

		if (Array.isArray(opts.includes) && opts.includes.indexOf(key) === -1) {
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

	if ('_' in input &&
		!(Array.isArray(opts.excludes) && opts.excludes.indexOf('_') !== -1) &&
		!(Array.isArray(opts.includes) && opts.includes.indexOf('_') === -1)) {

		var val = input._;

		if (typeof val === 'string') {
			args.push(val);
		}

		if (typeof val === 'number' && !numberIsNan(val)) {
			args.push('' + val);
		}

		if (Array.isArray(val)) {
			val.forEach(function (arrVal) {
				args.push(arrVal);
			});
		}
	}

	return args;
};
