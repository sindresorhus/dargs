'use strict';
var assert = require('assert');
var dargs = require('./');

var fixture = {
	1: true,
	'2': true,
	a: 'foo',
	aa: 'foo',
	b: true,
	bb: true,
	c: false,
	cc: false,
	d: 5,
	dd: 5,
	e: ['foo', 'bar'],
	ee: ['foo', 'bar'],
	f: null,
	ff: null,
	g: undefined,
	gg: undefined,
	h: NaN,
	hh: NaN,
	X: 10,
	'-': true,
	'#': true,
	'': true,
	' trim ': true,
	' ': 5,
	camelCaseCamel: true
};

describe('dargs()', function () {
	it('convert options to cli flags', function () {
		var actual = dargs(fixture);
		var expected = [
			'-1',
			'-2',
			'-a foo',
			'--aa=foo',
			'-b',
			'--bb',
			'-d 5',
			'--dd=5',
			'-e foo',
			'-e bar',
			'--ee=foo',
			'--ee=bar',
			'-X 10',
			'--trim',
			'--camel-case-camel'
		];
		assert.deepEqual(actual, expected);
	});

	it('exclude options', function () {
		var actual = dargs(fixture, ['b', 'd', 'ee', 'aa']);
		var expected = [
			'-1',
			'-2',
			'-a foo',
			'--bb',
			'--dd=5',
			'-e foo',
			'-e bar',
			'-X 10',
			'--trim',
			'--camel-case-camel'
		];
		assert.deepEqual(actual, expected);
	});
});
