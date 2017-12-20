# JSONForms - More Forms. Less Code
### Complex Forms in the blink of an eye

JSONForms uses HTML custom elements and eliminates the need to write HTML templates in order to
create forms by leveraging the capabilities of JSON and JSON schema.

# Usage
JSONForms is based on [Custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements),
which are not yet supported by all browsers, hence you'll need to include additional files in order to enable Custom Elements support:
These files are `webcomponents-lite.js` and `native-shim.js` as well as JSONForms itself via `jsonforms.js`.
Pay attention to the order when including these files.

Once you add a `json-forms` element to the DOM with at least a `data` attribute set,
a form will be rendered for you.
Data and UI schemas can be configured by the `dataSchema` and `uiSchema` attributes.
Use CSS to style the form however you want.

## Step by Step Example Usage

1. Install JSONForms via `npm install jsonforms@next`
2. Add `webcomponents-lite.js`, `native-shim.js`, `jsonforms.js` and `jsonforms-example.css` to your HTML
  ```html
    <head>
    <script src="/node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js"></script>
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
* Hook up dependencies between packages: `lerna bootstrap`

## Build & Testing
* Build (all packages): `lerna run build`
* Test (all packages): `lerna run test`
* Clean (delete `dist` folder of all packages): `lerna run clean`
* Run default examples: `cd packages/default && npm run dev`
* Run materialized examples: `cd packages/materialized && npm run dev`

## Continuous Integration
The JSONForms project is build and tested via [Travis](https://travis-ci.org/). Coverage is documented by [Coveralls](https://coveralls.io).

Current status: [![Build Status](https://travis-ci.org/eclipsesource/jsonforms.svg?branch=jsonforms2)](https://travis-ci.org/eclipsesource/jsonforms) [![Coverage Status](https://coveralls.io/repos/eclipsesource/jsonforms/badge.svg?branch=jsonforms2&service=github)](https://coveralls.io/github/eclipsesource/jsonforms?branch=jsonforms2)

## Deployment
 * Execute `npm run publishNpmAndGithub` in the root folder. This will lint, build, test and publish all packages.

# License
The JSONForms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.

# Roadmap
Our current roadmap is available [here](https://github.com/eclipsesource/jsonforms/blob/master/ROADMAP.md).
