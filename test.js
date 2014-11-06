'use strict';
var deepEqual = require('array-equal');
var test = require('ava');
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

test('convert options to cli flags', function (t) {
	var actual = dargs(fixture);
	var expected = [
		'--a=foo',
		'--b',
		'--d=5',
		'--e=foo',
		'--e=bar',
		'--h=with a space',
		'--i=let\'s try quotes',
		'--camel-case-camel'
	];
	t.assert(deepEqual(actual, expected));
	t.end();
});

test('exclude options', function (t) {
	var actual = dargs(fixture, ['b', 'e', 'h', 'i']);
	var expected = [
		'--a=foo',
		'--d=5',
		'--camel-case-camel'
	];
	t.assert(deepEqual(actual, expected));
	t.end();
});

test('includes options', function (t) {
	var actual = dargs(fixture, [], ['a', 'c', 'd', 'e', 'camelCaseCamel']);
	var expected = [
		'--a=foo',
		'--d=5',
		'--e=foo',
		'--e=bar',
		'--camel-case-camel'
	];
	t.assert(deepEqual(actual, expected));
	t.end();
});

test('excludes and includes options', function (t) {
	var actual = dargs(fixture, ['a', 'd'], ['a', 'c', 'd', 'e', 'camelCaseCamel']);
	var expected = [
		'--e=foo',
		'--e=bar',
		'--camel-case-camel'
	];
	t.assert(deepEqual(actual, expected));
	t.end();
});
