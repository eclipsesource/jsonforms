# JSONForms - More Forms. Less Code
### Complex Forms in the blink of an eye

# Usage
We're updating our usage instructions right now! Stay tuned!

# Developers Documentation

## First time setup
* Install [node.js](https://nodejs.org/)(version > 4.x.x)
* Clone this repository
* Install dependencies: `npm install`
* Hook up dependencies between packages: `lerna bootstrap`

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

