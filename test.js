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
	i: 'let\'s try quotes',
	camelCaseCamel: true
};

test('convert options to cli flags', function (t) {
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
	t.assert(deepEqual(actual, expected));
	t.end();
});

test('exclude options', function (t) {
	var actual = dargs(fixture, {excludes: ['b', /^e$/, 'h', 'i']});
	var expected = [
		'--a=foo',
		'--no-c',
		'--d=5',
		'--camel-case-camel'
	];
	t.assert(deepEqual(actual, expected));
	t.end();
});

test('includes options', function (t) {
	var actual = dargs(fixture, {includes: ['a', 'c', 'd', 'e', /^camelCase.*/]});
	var expected = [
		'--a=foo',
		'--no-c',
		'--d=5',
		'--e=foo',
		'--e=bar',
		'--camel-case-camel'
	];
	t.assert(deepEqual(actual, expected));
	t.end();
});

test('excludes and includes options', function (t) {
	var actual = dargs(fixture, {
		excludes: ['a', 'd'],
		includes: ['a', 'c', /^[de]$/, 'camelCaseCamel']
	});
	var expected = [
		'--no-c',
		'--e=foo',
		'--e=bar',
		'--camel-case-camel'
	];
	t.assert(deepEqual(actual, expected));
	t.end();
});

test('option to ignore false values', function (t) {
	var actual = dargs({foo: false}, {ignoreFalse: true});
	t.assert(deepEqual(actual, []));
	t.end();
});
