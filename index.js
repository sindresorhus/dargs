'use strict';

var constructOption = function (name, value) {
	var prefix;
	var delimiter;

	if (name.length === 1) { // short option
		prefix = '-';
		delimiter = ' ';
	} else { // long option
		prefix = '--';
		delimiter = '=';

		// camelCase -> camel-case
		name = name.replace(/[A-Z]/g, '-$&').toLowerCase();
	}

	return prefix + name + (value ? delimiter + value : '');
};

module.exports = function (options, excludes) {
	var args = [];

	if (!Array.isArray(excludes)) {
		excludes = [];
	}

	// exclude a special case which
	// produces invalid/unexpected output
	excludes.push('');

	Object.keys(options).forEach(function (name) {
		var val = options[name];

		name = name.trim();

		if (excludes.indexOf(name) !== -1) {
			return;
		}

		if (name.length === 1 && !/^[A-Za-z0-9]$/.test(name)) {
			// that's an invalid (non-alphanumeric) short option
			return;
		}

		if (val === true) {
			args.push(constructOption(name));
		}

		if (typeof val === 'string') {
			args.push(constructOption(name, val));
		}

		if (typeof val === 'number' && isNaN(val) === false) {
			args.push(constructOption(name, '' + val));
		}

		if (Array.isArray(val)) {
			val.forEach(function (arrVal) {
				args.push(constructOption(name, arrVal));
			});
		}
	});

	return args;
};
