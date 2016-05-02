# JSONForms - Customizable AngularJS forms based on JSON Schema

JSONForms extends the AngularJS view model approach by eliminating the need to write HTML templates in order to
create forms by leveraging the capabilities of JSON and JSON schema.

# First time setup
* Install [node.js](https://nodejs.org/)(version > 4.x.x)
* Install [typings](https://github.com/typings/typings): `npm install -g typings` 
* Install [tslint](https://palantir.github.io/tslint/): `npm install -g tslint`
* Install [webpack](https://github.com/webpack/webpack): `npm install -g webpack`
* Clone this repository
* Install dependencies: `npm install`

# Build & Testing
* Build: `npm run build` (runs `tslint` as well)
* Test: `npm run test`

# Continuous Integration
The JSONForms project is build and tested via [Travis](https://travis-ci.org/). Coverage is documented by [Coveralls](https://coveralls.io).

Current status: [![Build Status](https://travis-ci.org/eclipsesource/jsonforms.svg?branch=master)](https://travis-ci.org/eclipsesource/jsonforms) [![Coverage Status](https://coveralls.io/repos/eclipsesource/jsonforms/badge.svg?branch=master&service=github)](https://coveralls.io/github/eclipsesource/jsonforms?branch=master)

# Deployment

TODO: deploy tasks needs to ported

* Build the distribution
* Increase version in [package.json](https://github.com/eclipsesource/jsonforms/blob/master/package.json) and [bower.json](https://github.com/eclipsesource/jsonforms/blob/master/bower.json)
* Commit version bump to the current branch
* Checkout a new temporary deploy-branch
* Modify [LICENSE](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) file to include all necessary licenses of redistributed libraries
* Commit distribution files and [LICENSE](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) file
* Create a new version tag
* Push the version tag to 'upstream'

# License
The JSONForms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.