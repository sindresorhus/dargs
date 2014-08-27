'use strict';

var escape = function (value, quote) {
	if(!quote) {
		return value;
	}

	return quote === "'" ? 
		value.replace(/'/g, "'\''") : 
		value.replace(new RegExp(quote, 'g'), '\\' + quote);
};

var constructOption = function (name, value, quote) {
	name = name.replace(/[A-Z]/g, '-$&').toLowerCase();
	var quotedVal = /\W/.test(value) && quote ? (quote + escape(value, quote) + quote) : value;

	return '--' + name + (value ? "=" + quotedVal : '');
};

module.exports = function (options, excludes, unquoted, quote) {
	if(quote === undefined) {
		quote = "'";
	}

	var args = [];

	Object.keys(options).forEach(function (name) {
		var val = options[name];

		if (Array.isArray(excludes) && excludes.indexOf(name) !== -1) {
			return;
		}

		var quoted = Array.isArray(unquoted) ? unquoted.indexOf(name) === -1 : true;

		if (val === true) {
			args.push(constructOption(name));
		}

		if (typeof val === 'string') {
			args.push(constructOption(name, val, quoted ? quote : ''));
		}

		if (typeof val === 'number' && isNaN(val) === false) {
			args.push(constructOption(name, '' + val, quoted ? quote : ''));
		}

		if (Array.isArray(val)) {
			val.forEach(function (arrVal) {
				args.push(constructOption(name, arrVal, quoted ? quote : ''));
			});
		}
	});

	return args;
};
