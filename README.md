# JSONForms - More Forms. Less Code
### Complex AngularJS Forms in the blink of an eye

JSONForms extends the AngularJS view model approach by eliminating the need to write HTML templates in order to
create forms by leveraging the capabilities of JSON and JSON schema.

# Usage
1. Install JSON Forms via `npm install jsonforms` and require it via `require('jsonforms')`
2. Annotate the element, where you want to place a form, with a `jsf` class attribute.
3. Add `jsonforms` as a dependency to your AngularJS app:
  
  ```
  var myApp = angular.module('myApp', ['jsonforms', ...])
  ```
4. Load `jsonforms.css` in the head section:
  
  ```html 
  <link rel="stylesheet" type="text/css" href="node_modules/jsonforms/dist/jsonforms.css">
  ```
5. Render a form with the `jsonforms` element:
  
  The simplest example looks like this, where `schema`, `uiSchema` and `data` are 
  properties of a aliased controller named `vm`:
  
  ```html 
  <div class="jsf">
    <jsonforms schema="vm.schema" uischema="vm.uiSchema" data="vm.data"></jsonforms>
  </div>
  ```

# Documentation and more information
For documentation, examples and more information, please see [jsonforms.org](http://github.eclipsesource.com/jsonforms/).

# Developers Documentation

## First time setup
* Install [node.js](https://nodejs.org/)(version > 4.x.x)
* Clone this repository
* Install dependencies: `npm install`
* Generate typings: `npm run typings-install`

## Build & Testing
* Normal Build: `npm run build` (runs `tslint` as well)
* Bootstrap Build: `npm run build-bootstrap`
* Material Build: `npm run build-material`
* Test: `npm run test`
* Watch: `npm run dev` (or `dev-bootstrap`, `dev-material`), point your browser to `http://localhost:8080/webpack-dev-server/`

## How to run the examples 
JSONForms ships with a couple of examples. The examples' dependencies are managed
via bower, hence you'll first need to run the following commands from
the project root directory:

```
cd examples
bower install
```

Also make sure that you have [followed the instructions](https://github.com/eclipsesource/jsonforms#first-time-setup) for the first time setup in case you haven't done so already.
 
Now you start the example by running `npm run dev` and then pointing 
your browser to `http://localhost:8080`.

Note that for running the `placeholder` example you'll first need to start
[jsonplaceholder](https://jsonplaceholder.typicode.com/) which provides 
a fake REST API. You can do so via

```
npm run start-placeholder
```

## Continuous Integration
The JSONForms project is build and tested via [Travis](https://travis-ci.org/). Coverage is documented by [Coveralls](https://coveralls.io).

Current status: [![Build Status](https://travis-ci.org/eclipsesource/jsonforms.svg?branch=master)](https://travis-ci.org/eclipsesource/jsonforms) [![Coverage Status](https://coveralls.io/repos/eclipsesource/jsonforms/badge.svg?branch=master&service=github)](https://coveralls.io/github/eclipsesource/jsonforms?branch=master)

## Deployment
 * Locally login as one of the (npm) owners of the package ([npm doc](https://docs.npmjs.com/cli/adduser))
 * Make sure your workspace looks exactly the way you want to release it. (Files specified in [.npmignore](https://github.com/eclipsesource/jsonforms/blob/master/.npmignore) are normally ignored by npm, but this functionality is buggy. Therefore to be sure you should still remove all unwanted files before deploying.)
 * Run either ```npm run publish-patch```,```npm run publish-minor``` or ```npm run publish-major```.

The script does the following:
* Build all JSONForms alternatives
* Execute tests
* Increase version in [package.json](https://github.com/eclipsesource/jsonforms/blob/master/package.json)
* Commit version bump to the current branch
* Checkout a new temporary deploy-branch
* Commit ```dist/jsonforms.js``` file
* Create a new version tag
* Push the version tag to 'upstream'
* Release the workspace to [npmjs](https://www.npmjs.com/)

If any of the steps fail the script will abort. If the script was successful you should create a pull-request with the version bump commit to 'upstream'.

# License
The JSONForms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.

# Roadmap
Our current roadmap is available [here](https://github.com/eclipsesource/jsonforms/blob/master/ROADMAP.md).
