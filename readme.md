# dargs [![Build Status](https://travis-ci.org/sindresorhus/dargs.svg?branch=master)](https://travis-ci.org/sindresorhus/dargs)

> Converts an object of options into an array of command-line arguments

Basically the inverse of an argument parser like nopt or minimist. Useful when calling command-line tools.


## Install

```sh
$ npm install --save dargs
```


#### Usage

```js
var dargs = require('dargs');

var options = {
	foo: 'bar',
	hello: true,                    // results in only the key being used
	cake: false,                    // ignored
	camelCase: 5,                   // camelCase is slugged to `camel-case`
	multiple: ['value', 'value2'],  // converted to multiple arguments
	sad: ':('
};

var excludes = ['sad'];

console.log(dargs(options, excludes));

/*
[
	"--foo='bar'",
	"--hello",
	"--camel-case='5'",
	"--multiple='value'",
	"--multiple='value2'"
]
*/
```

## Another example
```js
var dargs = require('dargs');

var options = {
	foo: 'bar',
	hello: true,                    // results in only the key being used
	cake: false,                    // ignored
	camelCase: 5,                   // camelCase is slugged to `camel-case`
	multiple: ['value', 'value2'],  // converted to multiple arguments
	sad: ':('
};

var excludes = ['sad'];
var unquoted = ['camelCase'];

console.log(dargs(options, excludes, unquoted, '"'));

/*
[
  '--foo="bar"',
  '--hello',
  '--camel-case=5',
  '--multiple="value"',
  '--multiple="value2"' 
]
*/
```

## API

### dargs(options, excludes, unquoted, quote)

#### options

Type: `object`

Options to convert to command-line arguments.

#### excludes

Type: `array`

Keys to exclude.

#### unquoted

Type: `array`

Keys which shouldn't be wrapped in quotes.

#### quote

Type: `string`

Character to use for quoting string, defaults to `'`.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
