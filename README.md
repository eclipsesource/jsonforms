# JSONForms - More Forms. Less Code
### Complex Forms in the blink of an eye

JSONForms uses HTML custom elements and eliminates the need to write HTML templates in order to
create forms by leveraging the capabilities of JSON and JSON schema.

# Usage
To use JSONForms add `native-shim.js` and `jsonforms.js` to your HTML in this order. Once you add a `json-forms` element to the DOM with at least a `data` attribute set, a form will be rendered for you. Data and UI schemas can be configured by the `dataSchema` and `uiSchema` attributes. Use CSS to style the form however you want.

## Step by Step Example Usage

1. Install JSONForms via `npm install jsonforms@next`
2. Add `native-shim.js`, `jsonforms.js` and `jsonforms-example.css` to your HTML
  ```html
    <head>
    <script src="node_modules/jsonforms/lib/native-shim.js"></script>
    <script src="node_modules/jsonforms/dist/jsonforms.js"></script>
    <link rel="stylesheet" type="text/css" href="node_modules/jsonforms/dist/jsonforms-example.css">
    </head>
  ```
3. Add Javascript to create a `json-forms` element:
  ```html
  <script>
    var jsonForms = document.createElement('json-forms');
    jsonForms.data = {name:'John Doe'};
    document.body.appendChild(jsonForms);
  </script>
  ```

The whole document may for example now look like this:
  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <script src="node_modules/jsonforms/lib/native-shim.js"></script>
      <script src="node_modules/jsonforms/dist/jsonforms.js"></script>
      <link rel="stylesheet" type="text/css" href="node_modules/jsonforms/dist/jsonforms-example.css">
    </head>
    <body></body>
    <script>
      var jsonForms = document.createElement('json-forms');
      jsonForms.data = {name:'John Doe'};
      document.body.appendChild(jsonForms);
    </script>
  </html>
  ```
4. Optional: Add you own Data and UI schema within the script
  ```html
    <script>
      var jsonForms = document.createElement('json-forms');
      jsonForms.data = {name:'John Doe'};
      jsonForms.dataSchema = {type: "object", properties: {name : { type: "string"}}};
      jsonForms.uiSchema = {type: "Control", scope: { $ref: "#/properties/name" } };
      document.body.appendChild(jsonForms);
    </script>
  ```
  
# Developers Documentation

## First time setup
* Install [node.js](https://nodejs.org/)(version > 4.x.x)
* Clone this repository
* Install dependencies: `npm install`
* Install typescript: `npm install -g typescript`

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
* Build JSONForms
* Execute tests
* Increase version in [package.json](https://github.com/eclipsesource/jsonforms/blob/master/package.json)
* Commit version bump to the current branch
* Checkout a new temporary deploy-branch
* Commit ```dist/**/*``` directory
* Create a new version tag
* Push the version tag to 'upstream'
* Release the workspace to [npmjs](https://www.npmjs.com/)

If any of the steps fail the script will abort. If the script was successful you should create a pull-request with the version bump commit to 'upstream'.

# License
The JSONForms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.

# Roadmap
Our current roadmap is available [here](https://github.com/eclipsesource/jsonforms/blob/master/ROADMAP.md).
