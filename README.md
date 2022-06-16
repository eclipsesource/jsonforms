# JSON Forms - More Forms. Less Code

*Complex forms in the blink of an eye*

## Documentation

Please see the official JSON Forms website, [jsonforms.io](https://jsonforms.io), for documentation, examples and API references.

## Getting started

1. Clone the seed app with `git clone https://github.com/eclipsesource/jsonforms-react-seed.git`
2. Install dependencies with `npm ci`
3. Run the app with `npm run start`

For more info about the seed app, please see the corresponding README file of the [seed repo](https://github.com/eclipsesource/jsonforms-react-seed).
For a more detailed tutorial about the usage of JSON Forms, please see [this tutorial](http://jsonforms.io/docs/tutorial).

## Upgrading to JSON Forms 3.0

With version 3.0 of JSON Forms we removed `json-schema-ref-parser` from the core package.
This change only affects users of the React variant (Vue and Angular are not affected) and even for React only a few users will need to adjust their code.
To avoid issues and for more information, please have a look at our [migration guide](https://github.com/eclipsesource/jsonforms/blob/master/MIGRATION.md).

## Feedback, Help and Support

If you encounter any problems feel free to [open an issue](https://github.com/eclipsesource/jsonforms/issues/new/choose) on the repo.
For questions and discussions please use the [JSON Forms board](https://jsonforms.discourse.group).
You can also reach us via [email](mailto:jsonforms@eclipsesource.com?subject=JSON%20Forms).
In addition, EclipseSource also offers [professional support](https://jsonforms.io/support) for JSON Forms.

## Developers Documentation

### First time setup

* Install [node.js](https://nodejs.org/) (only Node 14 and npm 6 is currently supported)
* Clone this repository
* Install dependencies: `npm ci`
* Hook up dependencies between packages: `npm run init`

### VS Code dev container

As an alternative to the first time setup, you can use the provided [VS Code dev container](https://code.visualstudio.com/docs/remote/containers) configured in [devcontainer.json](.devcontainer/devcontainer.json).

* Execute command: `Remote Containers: Reopen in container`
* Wait until the container is built and loaded
* First time setup and an initial build of all packages has been executed in the container

### Build & Testing

* Build (all packages): `npm run build`
* Test (all packages): `npm run test`
* Clean (delete `dist` folder of all packages): `npm run clean`
* Run React Vanilla examples: `cd packages/vanilla && npm run dev`
* Run React Material examples: `cd packages/material && npm run dev`
* Run Angular Material examples: `cd packages/angular-material && npm run dev`
* Run Vue Vanilla dev setup: `cd packages/vue/vue-vanilla && npm run serve`

### Dependency & Release management

For more info about how we handle dependencies and releases in the JSON Forms project, please see our [Developer Documentation wiki page](https://github.com/eclipsesource/jsonforms/wiki/Developer-documentation).

### Continuous Integration

The JSON Forms project is built and tested via Github actions on Linux, Mac and Windows. Coverage is documented by [Coveralls](https://coveralls.io).

Current status: ![Build status](https://github.com/eclipsesource/jsonforms/actions/workflows/ci.yaml/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/eclipsesource/jsonforms/badge.svg?branch=master&service=github)](https://coveralls.io/github/eclipsesource/jsonforms?branch=master)

## License

The JSON Forms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.

## Migration

See our [migration guide](https://github.com/eclipsesource/jsonforms/blob/master/MIGRATION.md) when updating JSON Forms.
