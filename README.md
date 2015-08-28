# JSONForms - AngularJS based forms made easy

JSONForms extends he AngularJS view model approach by eliminating the need to write HTML templates in order to
create forms by leveraging the capabilities of JSON and JSON schema.

# First time setup
* Install node.js (https://nodejs.org/)
* Install grunt-cli via the command "npm install -g grunt-cli"
* Clone this repository
* Execute "npm install" in root of your cloned repository

# Build
JSON Forms uses Grunt to build and test.

* Run "grunt" or "grunt dist" to build the distribution
* Run "grunt app" to build the application
* Run "grunt test" to test the framework and the application
* Run "grunt watch" during development to automatically rebuild the distribution and application when any of the development files are touched.

# Travis
The Json Forms project is build and tested via Travis.

Current status: [![Build Status](https://travis-ci.org/eclipsesource/jsonforms.svg?branch=master)](https://travis-ci.org/eclipsesource/jsonforms)
