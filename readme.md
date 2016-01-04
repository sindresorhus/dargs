# dargs [![Build Status](https://travis-ci.org/sindresorhus/dargs.svg?branch=master)](https://travis-ci.org/sindresorhus/dargs)

> Reverse [`minimist`](https://github.com/substack/minimist). Convert an object of options into an array of command-line arguments.

Useful when spawning command-line tools.


## Install

```
$ npm install --save dargs
```


#### Usage

```js
const dargs = require('dargs');

const input = {
	foo: 'bar',
	hello: true,                    // results in only the key being used
	cake: false,                    // prepends `no-` before the key
	camelCase: 5,                   // camelCase is slugged to `camel-case`
	multiple: ['value', 'value2'],  // converted to multiple arguments
	pieKind: 'cherry',
	sad: ':('
};

const excludes = ['sad', /.*Kind$/];  // excludes and includes accept regular expressions
const includes = ['camelCase', 'multiple', 'sad', /^pie.*/];
const aliases = {file: 'f'};

console.log(dargs(input, {excludes: excludes}));
/*
[
	'--foo=bar',
	'--hello',
	'--no-cake',
	'--camel-case=5',
	'--multiple=value',
	'--multiple=value2'
]
*/

console.log(dargs(input, {
	excludes: excludes,
	includes: includes
}));
/*
[
	'--camel-case=5',
	'--multiple=value',
	'--multiple=value2'
]
*/


console.log(dargs(input, {includes: includes}));
/*
[
	'--camel-case=5',
	'--multiple=value',
	'--multiple=value2',
	'--pie-kind=cherry',
	'--sad=:('
]
*/


console.log(dargs({
	foo: 'bar',
	hello: true,
	file: 'baz'
}, {
	aliases: aliases
}));
/*
[
	'--foo=bar',
	'--hello',
	'-f baz'
]
*/

// You can override the default separator
console.log(dargs(input, {
	includes: includes,
	separator: ' '
}));
/*
[
	'--camel-case 5',
	'--multiple value',
	'--multiple value2',
	'--sad :(',
	'--pie-kind cherry'
]
*/
```

## API

### dargs(input, options)

#### input

*Required*  
Type: `object`

Object to convert to command-line arguments.

#### options

Type: `object`

##### excludes

Type: `array`

Keys or regex of keys to exclude. Takes precedence over `includes`.

##### includes

Type: `array`

Keys or regex of keys to include.

<<<<<<< ea3815451ef5a2b46ac199f19e0ce1ee71b940fe
##### aliases

Type: `object`

Maps keys in `input` to an aliased name. Matching keys are converted to options with a single dash ("-") in front of the aliased name and a space separating the aliased name from the value. Keys are still affected by `includes` and `excludes`.
=======

##### separator

Type: `String`  
Default: `=`

String to separate keys from values in command-line arguments.
>>>>>>> Allow the user to configure the separator between command line arguments

##### ignoreFalse

Type: `boolean`  
Default: `false`

Don't include `false` values. This is mostly useful when dealing with strict argument parsers that would throw on unknown arguments like `--no-foo`.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
