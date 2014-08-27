'use strict';

var escape = function (value) {
	return value.replace(/'/g, "'\''");
};

var removeQuotes = function (value) {
	return value.replace(/'/g, "");
};

var constructOption = function (name, value) {
	name = name.replace(/[A-Z]/g, '-$&').toLowerCase();
	var quotedVal = /\W/.test(value) ? ("'" + escape(value) + "'") : value;

	return '--' + name + (value ? "=" + quotedVal : '');
};

module.exports = function (options, excludes, preferences) {
	var args = [];
	var unquote = (typeof preferences === 'object' && preferences.unquote) ? true : false;

	Object.keys(options).forEach(function (name) {
		var val = options[name];
		var push;

		if (Array.isArray(excludes) && excludes.indexOf(name) !== -1) {
			return;
		}

		if (val === true) {
			push = constructOption(name);
			args.push(push);
		}

		if (typeof val === 'string') {
			push = (unquote && val.indexOf(' ') === -1) ? removeQuotes(constructOption(name, val)) : constructOption(name, val);
			args.push(push);
		}

		if (typeof val === 'number' && isNaN(val) === false) {
			push = unquote ? removeQuotes(constructOption(name, '' + val)) : constructOption(name, '' + val);
			args.push(push);
		}

		if (Array.isArray(val)) {
			val.forEach(function (arrVal) {
				push = (unquote && arrVal.indexOf(' ') === -1) ? removeQuotes(constructOption(name, arrVal)) : constructOption(name, arrVal);
				args.push(push);
			});
		}
	});

	return args;
};
