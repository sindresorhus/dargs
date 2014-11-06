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
	camelCaseCamel: true
};

it('convert options to cli flags', function () {
	var actual = dargs(fixture);
	var expected = [
		'--a=foo',
		'--b',
		'--no-c',
		'--d=5',
		'--e=foo',
		'--e=bar',
		'--h=with a space',
		'--i=let\'s try quotes',
		'--camel-case-camel'
	];
	assert.deepEqual(actual, expected);
});

it('exclude options', function () {
	var actual = dargs(fixture, ['b', 'e', 'h', 'i']);
	var expected = [
		'--a=foo',
		'--no-c',
		'--d=5',
		'--camel-case-camel'
	];
	assert.deepEqual(actual, expected);
});

it('includes options', function () {
	var actual = dargs(fixture, [], ['a', 'c', 'd', 'e', 'camelCaseCamel']);
	var expected = [
		'--a=foo',
		'--no-c',
		'--d=5',
		'--e=foo',
		'--e=bar',
		'--camel-case-camel'
	];
	assert.deepEqual(actual, expected);
});

it('excludes and includes options', function () {
	var actual = dargs(fixture, ['a', 'd'], ['a', 'c', 'd', 'e', 'camelCaseCamel']);
	var expected = [
		'--no-c',
		'--e=foo',
		'--e=bar',
		'--camel-case-camel'
	];
	assert.deepEqual(actual, expected);
});
