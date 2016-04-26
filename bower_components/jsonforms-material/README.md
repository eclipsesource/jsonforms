# JSON Forms - Material

JSON Forms Material provides a renderer set with Material-Design for JSON Forms.

# First time setup
* Install node.js (https://nodejs.org/)
* Install grunt-cli via the command ```npm install -g grunt-cli```
* Clone this repository
* Execute ```npm install``` in root of your cloned repository

# Build
JSONForms uses [Grunt](http://gruntjs.com/) to build and test.

* Run ```grunt``` or ```grunt dist``` to build the distribution
* Run ```grunt test``` to test the framework
* Run ```grunt clean:all``` if you want to clean the whole project

# Continuous Integration
The JSONForms project is build and tested via [Travis](https://travis-ci.org/). Coverage is documented by [Coveralls](https://coveralls.io).

Current status: [![Build Status](https://travis-ci.org/eclipsesource/jsonforms-material.svg?branch=master)](https://travis-ci.org/eclipsesource/jsonforms-material) [![Coverage Status](https://coveralls.io/repos/github/eclipsesource/jsonforms-material/badge.svg?branch=master)](https://coveralls.io/github/eclipsesource/jsonforms-material?branch=master)

# Deployment

Run ```grunt deploy``` to deploy a new version. The following tasks are executed:

* Build the distribution
* Increase version in [package.json](https://github.com/eclipsesource/jsonforms-extras/blob/master/package.json)
* Commit version bump to the current branch
* Checkout a new temporary deploy-branch
* Commit distribution files
* Create a new version tag
* Push the version tag to 'upstream'

# License
The JSONForms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms-extras/blob/master/LICENSE) for more information.
