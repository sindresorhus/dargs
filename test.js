import test from 'ava';
import fn from './';

const fixture = {
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
	t.same(fn(fixture), [
		'--a=foo',
		'--b',
		'--no-c',
		'--d=5',
		'--e=foo',
		'--e=bar',
		'--h=with a space',
		'--i=let\'s try quotes',
		'--camel-case-camel'
	]);
});

test('separator options', t => {
	t.same(fn(fixture, {
		separator: ' '
	}), [
		'--a foo',
		'--b',
		'--no-c',
		'--d 5',
		'--e foo',
		'--e bar',
		'--h with a space',
		'--i let\'s try quotes',
		'--camel-case-camel'
	]);
});

test('exclude options', t => {
	t.same(fn(fixture, {excludes: ['b', /^e$/, 'h', 'i']}), [
		'--a=foo',
		'--no-c',
		'--d=5',
		'--camel-case-camel'
	]);
});

test('includes options', t => {
	t.same(fn(fixture, {includes: ['a', 'c', 'd', 'e', /^camelCase.*/]}), [
		'--a=foo',
		'--no-c',
		'--d=5',
		'--e=foo',
		'--e=bar',
		'--camel-case-camel'
	]);
});

test('excludes and includes options', t => {
	t.same(fn(fixture, {
		excludes: ['a', 'd'],
		includes: ['a', 'c', /^[de]$/, 'camelCaseCamel']
	}), [
		'--no-c',
		'--e=foo',
		'--e=bar',
		'--camel-case-camel'
	]);
});

test('option to ignore false values', t => {
	t.same(fn({foo: false}, {ignoreFalse: true}), []);
});

test('aliases option', t => {
	t.same(fn({a: 'foo', file: 'test'}, {
		aliases: {file: 'f'}
	}),
		[
			'--a=foo',
			'-f test'
		]);
});

test('includes and aliases options', t => {
	t.same(fn(fixture, {
		includes: ['a', 'c', 'd', 'e', 'camelCaseCamel'],
		aliases: {a: 'a'}
	}),
		[
			'-a foo',
			'--no-c',
			'--d=5',
			'--e=foo',
			'--e=bar',
			'--camel-case-camel'
		]);
});
