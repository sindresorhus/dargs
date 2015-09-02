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
	camelCaseCamel: true,
	foo: {
		prop1: true,
		prop2: {
			test: [1,2,3],
			test2: {
				a: false,
				b: true
			}
		},
		prop3: 'bar'
	}
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
		'--camel-case-camel',
		'--foo.prop1',
		'--foo.prop2.test=1,2,3',
		'--foo.prop2.test2.a',
		'--foo.prop2.test2.b',
		'--foo.prop3=bar'
	];
	t.assert(deepEqual(actual, expected));
	t.end();
});

test('exclude options', function (t) {
	var actual = dargs(fixture, {excludes: ['b', 'e', 'h', 'i', 'foo']});
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
	var actual = dargs(fixture, {includes: ['a', 'c', 'd', 'e', 'camelCaseCamel']});
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
		excludes: ['a', 'd', 'foo'],
		includes: ['a', 'c', 'd', 'e', 'camelCaseCamel']
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

test('keepCamelCase option', function(t) {
	var actual = dargs(fixture, {
		keepCamelCase: true,
		excludes: ['foo']
	});
	var expected = [
		'--a=foo',
		'--b',
		'--no-c',
		'--d=5',
		'--e=foo',
		'--e=bar',
		'--h=with a space',
		'--i=let\'s try quotes',
		'--camelCaseCamel'
	];
	t.assert(deepEqual(actual, expected));
	t.end();
});

test('option to ignore false values', function (t) {
	var actual = dargs({foo: false}, {ignoreFalse: true});
	t.assert(deepEqual(actual, []));
	t.end();
});
