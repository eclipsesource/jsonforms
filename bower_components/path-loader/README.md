# path-loader

Utility that provides a single API for loading the content of a path/URL.  This module works in the browser and in
io.js/Node.js.  Right now this module supports the following loaders:

* http/https: This loader is used by default in the browser and will also be used in io.js/Node.js if the location being
loaded starts with `http:` or `https:`
* file: This loader is the used by default in io.js/Node.js and will throw an error in the browser _(Due to how
locations are mapped to loaders, the only way to use the `file` loader in the browser is to attempt to load a file using
the URL-version of its location.  (Example: `file:///Users/not-you/projects/path-loader/package.json`))_

In the future, there will likely be a pluggable infrastructure for altering this list or overriding the loaders provided
by the project but for now that is not an option.

## Project Badges

* Build status: [![Build Status](https://travis-ci.org/whitlockjc/path-loader.svg)](https://travis-ci.org/whitlockjc/path-loader)
* Dependencies: [![Dependencies](https://david-dm.org/whitlockjc/path-loader.svg)](https://david-dm.org/whitlockjc/path-loader)
* Developer dependencies: [![Dev Dependencies](https://david-dm.org/whitlockjc/path-loader/dev-status.svg)](https://david-dm.org/whitlockjc/path-loader#info=devDependencies&view=table)
* Downloads: [![NPM Downloads Per Month](http://img.shields.io/npm/dm/path-loader.svg)](https://www.npmjs.org/package/path-loader)
* License: [![License](http://img.shields.io/npm/l/path-loader.svg)](https://github.com/whitlockjc/path-loader/blob/master/LICENSE)
* Version: [![NPM Version](http://img.shields.io/npm/v/path-loader.svg)](https://www.npmjs.org/package/path-loader)

## Installation

path-loader is available for both Node.js and the browser.  Installation instructions for each environment are below.

### Browser

Installation for browser applications can be done via [Bower][bower] or by downloading a standalone binary.

#### Using Bower

```
bower install path-loader --save
```

#### Standalone Binaries

The standalone binaries come in two flavors:

* [path-loader.js](https://raw.github.com/whitlockjc/path-loader/master/browser/path-loader.js): _108kb_, full source  and source maps
* [path-loader-min.js](https://raw.github.com/whitlockjc/path-loader/master/browser/path-loader-min.js): _20kb_, minified, compressed and no sourcemap

### Node.js

Installation for Node.js applications can be done via [NPM][npm].

```
npm install path-loader --save
```

## APIs

All examples below use a variable called `PathLoader`.  Here is how to create it in Node.js:

```js
var PathLoader = require('path-loader');
```

For the browser, `PathLoader` is exported.

## `load (location, [options], [callback])`

**Arguments**

* `location {string}` - The location of the document _(Can be an absolute or relative path/url.  If relative, the base
is dependent upon the environment: Node.js will default to `process.cwd()` and browser will default to
`window.location`)_
* `[options] {object}` - The options used for the loader
* `[options.method] {string}` - The HTTP method to use _(Only used in the browser or whenever you attempt to load
absolute URLs within Node.js)_
* `[options.prepareRequest] {function}` - The callback used to further alter the [Superagent request][superagent] prior
to making the request _(Like `options.method` when it comes to applicability.  Useful for when you need to load a
document that requires authentication/authorization to access.)_
* `[callback] {function}` - Typical error-first callback

**Response**

The response is always a `Promsie` even if you pass in a callback.  _(This does not mean you cannot use callbacks
without promises, it just means we use promises internally to drive things...even your callback.)_

**Examples**

The examples below are written for Node.js.  The only difference between the browser and Node.js is in the browser, you
would use `PathLoader` to call the APIs below instead of first doing a `require` and then using the variable name of
your choice.  So for example, you would use `PathLoader.load` instead of what you see below.  Everything else is
identical.

```js
var pathLoader = require('path-loader');
var YAML = require('js-yaml');

// Load a local file relatively (Promise)
pathLoader
  .load('./package.json')
  .then(JSON.parse)
  .then(function (document) {
    console.log(document.name + ' (' + document.version + '): ' + document.description);
  }, function (err) {
    console.error(err.stack);
  });

// Load a local file relatively (Callbacks)
pathLoader
  .load('./package.json', function (err, document) {
    if (err) {
      console.error(err.stack);
    } else {
      try {
        document = JSON.parse(document)
        console.log(document.name + ' (' + document.version + '): ' + document.description);
      } catch (err2) {
        callback(err2);
      }
    });

// Load a file from a url
pathLoader
  .load('https://api.github.com/repos/whitlockjc/path-loader')
  .then(JSON.parse)
  .then(function (document) {
    console.log(document.full_name + ': ' + document.description);
  }, function (err) {
    console.error(err.stack);
  });

// Load a file from a url (with auth)
pathLoader
  .load('https://api.github.com/repos/whitlockjc/path-loader', {
    prepareRequest: function (req) {
      req.auth('my-username', 'my-password')
    }
  })
  .then(JSON.parse)
  .then(function (document) {
    console.log(document.full_name + ': ' + document.description);
  }, function (err) {
    console.error(err.stack);
  });

// Loading a file that is YAML
pathLoader
  .load('/Users/not-you/projects/path-loader/.travis.yml')
  .then(YAML.safeLoad)
  .then(function (document) {
    console.log('path-loader uses the', document.language, 'language.');
  }, function (err) {
    console.error(err.stack);
  });

```

[bower]: http://bower.io/
[npm]: https://www.npmjs.com/
[superagent]: http://visionmedia.github.io/superagent/
