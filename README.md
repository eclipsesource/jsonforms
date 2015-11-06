# JSONForms - Customizable AngularJS forms based on JSON Schema

JSONForms extends the AngularJS view model approach by eliminating the need to write HTML templates in order to
create forms by leveraging the capabilities of JSON and JSON schema.

# First time setup
* Install node.js (https://nodejs.org/)
* Install grunt-cli via the command "npm install -g grunt-cli"
* Clone this repository
* Execute "npm install" in root of your cloned repository

# Build
JSONForms uses Grunt to build and test.

* Run "grunt" or "grunt dist" to build the distribution
* Run "grunt examples" to build the example application
* Run "grunt test" to test the framework and the examples applications
* Run "grunt watch" during development to automatically rebuild the distribution and application when any of the development files are touched.

# Travis
The JSONForms project is build and tested via Travis.

Current status: [![Build Status](https://travis-ci.org/eclipsesource/jsonforms.svg?branch=master)](https://travis-ci.org/eclipsesource/jsonforms)

# License
The JSONForms project is licensed under the MIT License. See the LICENSE file for more information.