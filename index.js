'use strict';
var numberIsNan = require('number-is-nan');

function createArg(key, val) {
	key = key.replace(/[A-Z]/g, '-$&').toLowerCase();

	var ret = ['--' + key];

	if (val) {
		ret.push(val);
	}

	return ret;
}

function match(arr, val) {
	return arr.some(function (x) {
		return x instanceof RegExp ? x.test(val) : x === val;
	});
}

module.exports = function (input, opts) {
	var args = [];
	var extraArgs = [];

	opts = opts || {};

	var createAliasArg = function (key, val) {
		args.push('-' + key);

		if (val) {
			args.push(val);
		}
	};

	Object.keys(input).forEach(function (key) {
		var val = input[key];

		var argFn = (key, val) => {
			var arg = createArg(key, val);

			if (opts.useEquals === false) {
				args.push.apply(args, arg);
			} else {
				args.push(arg.join('='));
			}
		};

		if (Array.isArray(opts.excludes) && match(opts.excludes, key)) {
			return;
		}

		if (Array.isArray(opts.includes) && !match(opts.includes, key)) {
			return;
		}

		if (typeof opts.aliases === 'object' && opts.aliases[key]) {
			key = opts.aliases[key];
			argFn = createAliasArg;
		}

		if (key === '_') {
			if (!Array.isArray(val)) {
				throw new TypeError('Expected key \'_\' to be an array, but found ' + (typeof val));
			}

			extraArgs = val;
			return;
		}

		if (val === true) {
			argFn(key, '');
		}

		if (val === false && !opts.ignoreFalse) {
			argFn('no-' + key);
		}

		if (typeof val === 'string') {
			argFn(key, val);
		}

		if (typeof val === 'number' && !numberIsNan(val)) {
			argFn(key, String(val));
		}

		if (Array.isArray(val)) {
			val.forEach(function (arrVal) {
				argFn(key, arrVal);
			});
		}
	});

	extraArgs.forEach(function (extraArgVal) {
		args.push(String(extraArgVal));
	});

	return args;
};
