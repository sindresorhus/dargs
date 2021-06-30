import test from 'ava';
import dargs from './index.js';

const fixture = {
	_: ['some', 'option'],
	'--': ['other', 'args', '-z', '--camelCaseOpt'],
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

test('convert options to cli flags', t => {
	t.deepEqual(dargs(fixture), [
		'-a=foo',
		'-b',
		'--no-c',
		'-d=5',
		'-e=foo',
		'-e=bar',
		'-h=with a space',
		'-i=let\'s try quotes',
		'--camel-case-camel',
		'some',
		'option',
		'--',
		'other',
		'args',
		'-z',
		'--camelCaseOpt' // Case unaffected for separated options
	]);
});

test('raises a TypeError if  \'_\' value is not an Array', t => {
	t.throws(dargs.bind(dargs, {a: 'foo', _: 'baz'}), {instanceOf: TypeError});
});

test('raises a TypeError if  \'--\' value is not an Array', t => {
	t.throws(dargs.bind(dargs, {a: 'foo', '--': 'baz'}), {instanceOf: TypeError});
});

test('useEquals options', t => {
	t.deepEqual(dargs(fixture, {
		useEquals: false
	}), [
		'-a',
		'foo',
		'-b',
		'--no-c',
		'-d',
		'5',
		'-e',
		'foo',
		'-e',
		'bar',
		'-h',
		'with a space',
		'-i',
		'let\'s try quotes',
		'--camel-case-camel',
		'some',
		'option',
		'--',
		'other',
		'args',
		'-z',
		'--camelCaseOpt'
	]);
});

test('exclude options', t => {
	t.deepEqual(dargs(fixture, {excludes: ['b', /^e$/, 'h', 'i']}), [
		'-a=foo',
		'--no-c',
		'-d=5',
		'--camel-case-camel',
		'some',
		'option',
		'--',
		'other',
		'args',
		'-z',
		'--camelCaseOpt'
	]);
});

test('includes options', t => {
	t.deepEqual(dargs(fixture, {includes: ['a', 'c', 'd', 'e', /^camelCase.*/]}), [
		'-a=foo',
		'--no-c',
		'-d=5',
		'-e=foo',
		'-e=bar',
		'--camel-case-camel'
	]);
});

test('excludes and includes options', t => {
	t.deepEqual(dargs(fixture, {
		excludes: ['a', 'd'],
		includes: ['a', 'c', /^[de]$/, 'camelCaseCamel']
	}), [
		'--no-c',
		'-e=foo',
		'-e=bar',
		'--camel-case-camel'
	]);
});

test('option to ignore true values', t => {
	t.deepEqual(dargs({foo: true}, {ignoreTrue: true}), []);
});

test('option to ignore false values', t => {
	t.deepEqual(dargs({foo: false}, {ignoreFalse: true}), []);
});

test('aliases option', t => {
	t.deepEqual(dargs({a: 'foo', file: 'test'}, {
		aliases: {file: 'f'}
	}), [
		'-a=foo',
		'-f',
		'test'
	]);
});

test('includes and aliases options', t => {
	t.deepEqual(dargs(fixture, {
		includes: ['a', 'c', 'd', 'e', 'camelCaseCamel'],
		aliases: {a: 'a'}
	}), [
		'-a',
		'foo',
		'--no-c',
		'-d=5',
		'-e=foo',
		'-e=bar',
		'--camel-case-camel'
	]);
});

test('camelCase option', t => {
	t.deepEqual(dargs(fixture, {
		allowCamelCase: true
	}), [
		'-a=foo',
		'-b',
		'--no-c',
		'-d=5',
		'-e=foo',
		'-e=bar',
		'-h=with a space',
		'-i=let\'s try quotes',
		'--camelCaseCamel',
		'some',
		'option',
		'--',
		'other',
		'args',
		'-z',
		'--camelCaseOpt'
	]);
});

test('shortFlag option', t => {
	t.deepEqual(dargs({a: 123, b: 'foo', foo: 'bar', camelCaseCamel: true}, {
		shortFlag: false
	}), [
		'--a=123',
		'--b=foo',
		'--foo=bar',
		'--camel-case-camel'
	]);
});
