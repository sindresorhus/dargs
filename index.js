'use strict';
var numberIsNan = require('number-is-nan');

function createArg(key, val, opts) {
	if(!opts.keepCamelCase) {
		key = key.replace(/[A-Z]/g, '-$&').toLowerCase();
	}

	if (val === true) {
		val = null;
	} else if (val === false && !opts.ignoreFalse) {
		key = 'no-' + key;
	}

	return '--' + key + (val ? '=' + val : '');
}

function createObjArg(prefix, obj, opts) {
	var args = [];
	opts.ignoreFalse = true;

	for (var key in obj) {
		var val = obj[key];
		var type = typeof obj[key];

		if (type && type === 'object' && !Array.isArray(val)) {
			args = args.concat(createObjArg(prefix + '.' + key, val, opts));
		} else {
			args.push(createArg(prefix + '.' + key, val, opts).slice(2));
		}
    }

    return args;
}

module.exports = function (input, opts) {
	var args = [];

	opts = opts || {};

	Object.keys(input).forEach(function (key) {
		var val = input[key];

		if (Array.isArray(opts.excludes) && opts.excludes.indexOf(key) !== -1) {
			return;
		}

		if (Array.isArray(opts.includes) && opts.includes.indexOf(key) === -1) {
			return;
		}

		if (val === false && opts.ignoreFalse) {
			return;
		}

		if (typeof val === 'string' || typeof val === 'boolean') {
			args.push(createArg(key, val, opts));
		}

		if (typeof val === 'number' && !numberIsNan(val)) {
			args.push(createArg(key, '' + val, opts));
		}

		if (Array.isArray(val)) {
			val.forEach(function (arrVal) {
				args.push(createArg(key, arrVal, opts));
			});
		}

		if (val && typeof val === 'object' && !Array.isArray(val)) {
			args = args.concat(createObjArg('--' + key, val, opts));
		}
	});

	return args;
};
