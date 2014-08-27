'use strict';
var assert = require('assert');
var dargs = require('./');

var fixture = {
	a: 'foo',
	b: true,
	c: false,
	d: 5,
	e: ['foo', 'bar'],
	f: null,
	g: undefined,
	h: 'with a space',
	i: "let's try quotes",
	j: ['with a space', '5', 'foo'],
	camelCaseCamel: true
};

var preferences = {
	unquote: true
};

describe('dargs()', function () {
	it('convert options to cli flags', function () {
		var actual = dargs(fixture);
		var expected = [
			"--a='foo'",
			"--b",
			"--d='5'",
			"--e='foo'",
			"--e='bar'",
			"--h='with a space'",
			"--i='let'\''s try quotes'",
			"--j='with a space'",
			"--j='5'",
			"--j='foo'",
			"--camel-case-camel"
		];
		assert.deepEqual(actual, expected);
	});

	it('exclude options', function () {
		var actual = dargs(fixture, ['b', 'e', 'h', 'i', 'j']);
		var expected = [
			"--a='foo'",
			"--d='5'",
			"--camel-case-camel"
		];
		assert.deepEqual(actual, expected);
	});

	it('returns unquoted', function () {
		var actual = dargs(fixture, ['b', 'i', 'camelCaseCamel'], preferences);
		var expected = [
			"--a=foo",
			"--d=5",
			"--e=foo",
			"--e=bar",
			"--h='with a space'",
			"--j='with a space'",
			"--j=5",
			"--j=foo"
		];
		assert.deepEqual(actual, expected);
	});
});
