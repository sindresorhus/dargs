'use strict';

const match = (arr, val) => arr.some(x => x instanceof RegExp ? x.test(val) : x === val);

module.exports = (input, opts) => {
	const args = [];
	let extraArgs = [];

	opts = Object.assign({
		useEquals: true
	}, opts);

	const makeArg = (key, val) => {
		key = '--' + key.replace(/[A-Z]/g, '-$&').toLowerCase(); // eslint-disable-line prefer-template

		if (opts.useEquals) {
			args.push(key + (val ? `=${val}` : ''));
		} else {
			args.push(key);

			if (val) {
				args.push(val);
			}
		}
	};

	const makeAliasArg = (key, val) => {
		args.push(`-${key}`);

		if (val) {
			args.push(val);
		}
	};

	Object.keys(input).forEach(key => {
		const val = input[key];
		let pushArg = makeArg;

		if (Array.isArray(opts.excludes) && match(opts.excludes, key)) {
			return;
		}

		if (Array.isArray(opts.includes) && !match(opts.includes, key)) {
			return;
		}

		if (typeof opts.aliases === 'object' && opts.aliases[key]) {
			key = opts.aliases[key];
			pushArg = makeAliasArg;
		}

		if (key === '_') {
			if (!Array.isArray(val)) {
				throw new TypeError(`Expected key \`_\` to be Array, got ${typeof val}`);
			}

			extraArgs = val;
			return;
		}

		if (val === true) {
			pushArg(key, '');
		}

		if (val === false && !opts.ignoreFalse) {
			pushArg(`no-${key}`);
		}

		if (typeof val === 'string') {
			pushArg(key, val);
		}

		if (typeof val === 'number' && !Number.isNaN(val)) {
			pushArg(key, String(val));
		}

		if (Array.isArray(val)) {
			val.forEach(arrVal => {
				pushArg(key, arrVal);
			});
		}
	});

	extraArgs.forEach(extraArgVal => {
		args.push(String(extraArgVal));
	});

	return args;
};
