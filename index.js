'use strict';

var escape = function (value) {
	return value.replace(/'/g, "'\''");
};

var constructOption = function (name, value) {
	name = name.replace(/[A-Z]/g, '-$&').toLowerCase();

	var namePrefix = '--';
	var delimiter = '=';
	var quote = "'"; // strong quote
	var valueChunk = '';

	if (value) {
		valueChunk = delimiter + quote + escape(value) + quote;
	}

	return namePrefix + name + valueChunk;
};

module.exports = function (options, excludes) {
	var args = [];

	Object.keys(options).forEach(function (name) {
		var val = options[name];

		if (Array.isArray(excludes) && excludes.indexOf(name) !== -1) {
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
