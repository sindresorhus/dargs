import {expectType, expectError} from 'tsd';
import dargs = require('.');

const input = {
	_: ['some', 'option'],
	foo: 'bar',
	hello: true,
	cake: false,
	camelCase: 5,
	multiple: ['value', 'value2'],
	pieKind: 'cherry',
	sad: ':('
};

const excludes = ['sad', /.*Kind$/];
const includes = ['camelCase', 'multiple', 'sad', /^pie.*/];
const aliases = {file: 'f'};

expectType<string[]>(dargs(input, {excludes}));
expectType<string[]>(dargs(input, {includes}));
expectType<string[]>(dargs(input, {aliases}));
expectType<string[]>(dargs(input, {useEquals: false}));
expectType<string[]>(dargs(input, {ignoreFalse: true}));
expectType<string[]>(dargs(input, {allowCamelCase: true}));

expectError(dargs({_: 'foo'}));
expectError(dargs({'--': 'foo'}));
