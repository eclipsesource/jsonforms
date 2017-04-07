# JSONForms - More Forms. Less Code
### Complex AngularJS Forms in the blink of an eye

JSONForms uses HTML custom elements and eliminates the need to write HTML templates in order to
create forms by leveraging the capabilities of JSON and JSON schema.

# Usage
1. Install JSON Forms via `npm install jsonforms`
2. Load `jsonforms-example.css` in the head section:

  ```html
  <script src="node_modules/jsonforms/dist/jsonforms.js"></script>
  ```
3. Load `jsonforms-example.css` in the head section:

  ```html
  <link rel="stylesheet" type="text/css" href="node_modules/jsonforms/dist/jsonforms-example.css">
  ```
5. Render a form with the `jsonforms` element:

  The simplest example looks like this:

  ```html
  <html>
  <head>
    ...
  </head>
  <body>
  </body>
  <script>
    var jsonForms = document.createElement('json-forms');
    jsonForms.data = {name:'John Doe'};
    document.body.appendChild(jsonForms);
  </script>
  </html>
  ```
# Documentation and more information
For documentation, examples and more information, please see [jsonforms.org](http://github.eclipsesource.com/jsonforms/).

# Developers Documentation

## First time setup
* Install [node.js](https://nodejs.org/)(version > 4.x.x)
* Clone this repository
* Install dependencies: `npm install`

## Build & Testing
* Normal Build: `npm run build`
* Test: `npm run test`
* Watch: `npm run dev`, point your browser to `http://localhost:8080/`

## Continuous Integration
The JSONForms project is build and tested via [Travis](https://travis-ci.org/). Coverage is documented by [Coveralls](https://coveralls.io).

Current status: [![Build Status](https://travis-ci.org/eclipsesource/jsonforms.svg?branch=jsonforms2)](https://travis-ci.org/eclipsesource/jsonforms) [![Coverage Status](https://coveralls.io/repos/eclipsesource/jsonforms/badge.svg?branch=jsonforms2&service=github)](https://coveralls.io/github/eclipsesource/jsonforms?branch=jsonforms2)

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
