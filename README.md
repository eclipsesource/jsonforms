# JSONForms - More Forms. Less Code
### Complex Forms in the blink of an eye

# Getting started
1. Clone the seed app with `git clone https://github.com/eclipsesource/jsonforms-react-seed.git`
2. Install dependencies with `npm ci` (or `npm install` when using an older version)
3. Run the app with `npm run start`

For more info about the seed app, please see the corresponding README file of the [seed repo](https://github.com/eclipsesource/jsonforms-react-seed).
For a more detailed tutorial about the usage of JSON Forms, please see [this tutorial](http://jsonforms.io/docs/tutorial).

# Developers Documentation

## First time setup
* Install [node.js](https://nodejs.org/) (version >= 6.x.x)
* Update npm (version >= 5.8.0)
* Clone this repository
* Install dependencies: `npm ci`
* Hook up dependencies between packages: `npx lerna bootstrap --hoist --npm-ci-mode`

## Build & Testing
* Build (all packages): `lerna run build`
* Test (all packages): `lerna run test`
* Clean (delete `dist` folder of all packages): `lerna run clean`
* Run vanilla examples: `cd packages/vanilla && npm run dev`
* Run material examples: `cd packages/material && npm run dev`

## Continuous Integration
The JSONForms project is build and tested via [Travis](https://travis-ci.org/). Coverage is documented by [Coveralls](https://coveralls.io).

Current status: [![Build Status](https://travis-ci.org/eclipsesource/jsonforms.svg?branch=master)](https://travis-ci.org/eclipsesource/jsonforms) [![Coverage Status](https://coveralls.io/repos/eclipsesource/jsonforms/badge.svg?branch=master&service=github)](https://coveralls.io/github/eclipsesource/jsonforms?branch=master)

# License
The JSONForms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.

# Migration
If you are already using JSONForms 1, check our [migration guide](https://github.com/eclipsesource/jsonforms/blob/master/MIGRATION.md).
