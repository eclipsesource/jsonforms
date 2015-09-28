# json-refs

Various utilities for [JSON References][json-reference-draft-spec], and [JSON Pointers][json-pointer-spec] since JSON
References are part JSON Pointer.

## Project Badges

* Build status: [![Build Status](https://travis-ci.org/whitlockjc/json-refs.svg)](https://travis-ci.org/whitlockjc/json-refs)
* Dependencies: [![Dependencies](https://david-dm.org/whitlockjc/json-refs.svg)](https://david-dm.org/whitlockjc/json-refs)
* Developer dependencies: [![Dev Dependencies](https://david-dm.org/whitlockjc/json-refs/dev-status.svg)](https://david-dm.org/whitlockjc/json-refs#info=devDependencies&view=table)
* Downloads: [![NPM Downloads Per Month](http://img.shields.io/npm/dm/json-refs.svg)](https://www.npmjs.org/package/json-refs)
* License: [![License](http://img.shields.io/npm/l/json-refs.svg)](https://github.com/whitlockjc/json-refs/blob/master/LICENSE)
* Version: [![NPM Version](http://img.shields.io/npm/v/json-refs.svg)](https://www.npmjs.org/package/json-refs)

## Installation

json-refs is available for both Node.js and the browser.  Installation instructions for each environment are below.

### Browser

Installation for browser applications can be done via [Bower][bower] or by downloading a standalone binary.

#### Using Bower

```
bower install json-refs --save
```

#### Standalone Binaries

The standalone binaries come in two flavors:

* [json-refs-standalone.js](https://raw.github.com/whitlockjc/json-refs/master/browser/json-refs-standalone.js): _396kb_, full source and source maps
* [json-refs-standalone-min.js](https://raw.github.com/whitlockjc/json-refs/master/browser/json-refs-standalone-min.js): _64kb_, minified, compressed
and no sourcemap

### Node.js

Installation for Node.js applications can be done via [NPM][npm].

```
npm install json-refs --save
```

## APIs

All examples below use a variable called `jsonRefs`.  Here is how to create it in Node.js:

```js
var jsonRefs = require('json-refs');
```

For the browser, `JsonRefs` is exported.

## `findRefs (json)`

**Arguments**

* `json {object}` - The JavaScript object to search for references

**Response**

An `object` whose keys are JSON Pointers to where the JSON Reference's `$ref` node is and the JSON Reference `string`.

## `isJsonReference (obj)`

**Arguments**

* `[obj] {*}` - The object to check

**Response**

`true` if the argument is an `object` and its `$ref` property is a JSON Pointer and `false` otherwise.

## `isRemotePointer (ptr)`

**Arguments**

* `ptr {*}` - The JSON Pointer to check

**Response**

`true` if the argument is an is a JSON Pointer to a remote document and `false` otherwise.

## `pathFromPointer (ptr)`

**Arguments**

* `ptr {string}` - A JSON Pointer string

**Response**

A `string[]` of path segments for the JSON Pointer unless its a remote reference in which case `ptr` is returned as-is.

**Example**

```js
console.log(jsonRefs.pathFromPointer('#/owner/login')); // ['owner', 'login']
```

## `pathToPointer (path)`

**Arguments**

* `path {string[]}` - An array of path segments.

**Response**

A `string` representing a JSON Pointer.

**Example**

```js
console.log(jsonRefs.pathToPointer(['owner', 'login'])); // #/owner/login
```

## `resolveRefs (json, options, done)`

**Arguments**

* `json {object}`: The JavaScript object containing zero or more JSON References
* `[options] {object}`: The options
* `[options.prepareRequest] {function}`: The callback used to prepare a request
* `[options.processContent] {function}`: The callback used to process the remote request content
* `done {function}`: An error-first callback to be called with the fully-resolved object and metadata for the reference
resolution

**Response**

If there is an `Error`, the callback is called with the `Error` in the first argument and `undefined` in the second
argument.  If there is no `Error`, the first argument is `undefined` and the second argument is an `object` whose value
is the fully resolved document.  The third argument is an `object` whose value is the reference resolution metadata.
Its keys are the location of the reference and it's values are as follows:

* `ref {string}`: The reference value as it existed in the original document
* `[value] {*}`: The resolved value of the reference, if there is one.  If this property was set, this means that the
reference was resolvable and it resolved to an explicit value.  If this property is not set, that means the reference
was unresolvable.  A value of `undefined` means that the reference was resolvable to an actual value of `undefined` and
is not indicative of an unresolvable reference.
* `

##Usage

**Note:** If you need to alter your request in any way, for example to add specific headers to the request or to add
authentication to the request or any other situation in which the request might need to be altered, you will need to use
the `options.prepareRequest` callback.  Here is a simple example that uses `options.prepareRequest` to make a secure
request using an Basic Authentication _(The example is written for Node.js but the actual business logic in how
`resolveRefs` is called sould be the same in the browser)_:

```js
var jsonRefs = require('json-refs');
var json = {
  name: 'json-refs',
  owner: {
    $ref: 'https://api.github.com/repos/whitlockjc/json-refs#/owner'
  }
};
jsonRefs.resolveRefs(json, {
  prepareRequest: function (req) {
    // Add the 'Basic Authentication' credentials
    req.auth('whitlockjc', 'MY_GITHUB_PASSWORD');

    // Add the 'X-API-Key' header for an API Key based authentication
    // req.set('X-API-Key', 'MY_API_KEY');
  }
}, function (err, rJson, metadata) {
  if (err) throw err;

  console.log(JSON.stringify(rJson)); // {name: 'json-refs', owner: {/* GitHub Repository Owner Information */}}
  console.log(JSON.stringify(metadata)); // {'#/owner/$ref': {ref: 'https://api.github.com/repos/whitlockjc/json-refs#/owner', value: {/*GitHub Repository Onwer Information */}}}
});
```

**Note:** If you need to pre-process the content of your remote requets, like to support data not explicitly supported
by Superagent, you can use the `options.processContent` callback.  Here is a simple example that uses
`options.processContent` to retrieve a YAML resource:

```js
var jsonRefs = require('json-resf');
var YAML = require('yamljs');

jsonRefs.resolveRefs({
  $ref: 'http://somehost/somefile.yaml'
}, {
  processContent: function (content) {
    return YAML.parse(content);
  }
}, function (err, rJson, metadata) {
  if (err) throw err;

  console.log(JSON.stringify(rJson)); // Document should be JSON equivalent of your YAML document
});
```

###Node.js
```js
var jsonRefs = require('json-refs');
var json = {
  name: 'json-refs',
  owner: {
    $ref: 'https://api.github.com/repos/whitlockjc/json-refs#/owner'
  }
};
jsonRefs.resolveRefs(json, function (err, rJson, metadata) {
  if (err) throw err;

  console.log(JSON.stringify(rJson)); // {name: 'json-refs', owner: {/* GitHub Repository Owner Information */}}
  console.log(JSON.stringify(metadata)); // {'#/owner/$ref': {ref: 'https://api.github.com/repos/whitlockjc/json-refs#/owner', value: {/*GitHub Repository Onwer Information */}}}
});
```

###Browser

**Bower**

```html
<html>
  <head>
    <title>Bower Example</title>
    <script src="bower_components/lodash/lodash.js"></script>
    <script src="bower_components/superagent/superagent.js"></script>
    <script src="bower_components/traverse/traverse.js"></script>
    <script src="bower_components/json-refs/browser/json-refs.js"></script>
  </head>
  <body>
  </body>
  <script>
    var json = {
      name: 'json-refs',
      owner: {
        $ref: 'https://api.github.com/repos/whitlockjc/json-refs#/owner'
      }
    };

    JsonRefs.resolveRefs(json, function (err, rJson) {
      if (err) throw err;

      console.log(rJson);
    });
  </script>
</html>
```

**Standalone**

```html
<html>
  <head>
    <title>Standalone Example</title>
    <script src="json-refs-standalone.js"></script>
  </head>
  <body>

  </body>
  <script>
    var json = {
      name: 'json-refs',
      owner: {
        $ref: 'https://api.github.com/repos/whitlockjc/json-refs#/owner'
      }
    };

    JsonRefs.resolveRefs(json, function (err, rJson) {
      if (err) throw err;

      console.log(rJson);
    });
  </script>
</html>
```
[bower]: http://bower.io/
[npm]: https://www.npmjs.com/
[json-reference-draft-spec]: http://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03
[json-pointer-spec]: http://tools.ietf.org/html/rfc6901
