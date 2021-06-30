import {expectType, expectError} from 'tsd';
import dargs from './index.js';

const object = {
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

expectType<string[]>(dargs(object, {excludes}));
expectType<string[]>(dargs(object, {includes}));
expectType<string[]>(dargs(object, {aliases}));
expectType<string[]>(dargs(object, {useEquals: false}));
expectType<string[]>(dargs(object, {shortFlag: true}));
expectType<string[]>(dargs(object, {ignoreTrue: true}));
expectType<string[]>(dargs(object, {ignoreFalse: true}));
expectType<string[]>(dargs(object, {allowCamelCase: true}));

expectError(dargs({_: 'foo'}));
expectError(dargs({'--': 'foo'}));
