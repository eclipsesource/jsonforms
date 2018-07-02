# JSONForms - More Forms. Less Code
### Complex Forms in the blink of an eye

JSONForms eliminates the tedious task of writing fully-featured forms by hand by leveraging the capabilities of JSON, JSON Schema and Javascript.

# Editor Package
This repository contains a re-usable tree component that renders a tree-master-detail JSON editor.
The repository contains an IDE webcomponent that additionally configures 3 buttons to access the data shown in the tree:
- A download button
- An export button that shows the data in a dialog
- A load button that opens a native file selection dialog to load a file from the user's harddrive

Additionally, the package contains a small runtime demo showing an editor for users and tasks.

## Build
Run `npm install` to install dependencies.
Run `npm run build` to build the module. The build results are located in `/dist/`.

## Run Demo
Run `npm run dev` to start the standalone editor. It is available at http://localhost:8080/

# License
The JSONForms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.

# Roadmap
Our current roadmap is available [here](https://github.com/eclipsesource/jsonforms/blob/master/ROADMAP.md).

# Development
JSONForms is developed by [EclipseSource](https://eclipsesource.com).
We are always very happy to have contributions, whether for trivial cleanups or big new features.

# Migration
If you are already using JSONForms 1, check our [migration guide](https://github.com/eclipsesource/jsonforms/blob/master/MIGRATION.md).