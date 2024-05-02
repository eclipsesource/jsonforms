# JSON Forms - More Forms. Less Code

_Complex forms in the blink of an eye_

## Documentation

Please see the official JSON Forms website, [jsonforms.io](https://jsonforms.io), for documentation, examples and API references.

## Getting started

1. Clone the seed app with `git clone https://github.com/eclipsesource/jsonforms-react-seed.git`
2. Install dependencies with `npm ci`
3. Run the app with `npm run start`

For more info about the seed app, please see the corresponding README file of the [seed repo](https://github.com/eclipsesource/jsonforms-react-seed).
For a more detailed tutorial about the usage of JSON Forms, please see [this tutorial](http://jsonforms.io/docs/tutorial).

## Feedback, Help and Support

If you encounter any problems feel free to [open an issue](https://github.com/eclipsesource/jsonforms/issues/new/choose) on the repo.
For questions and discussions please use the [JSON Forms board](https://jsonforms.discourse.group).
You can also reach us via [email](mailto:jsonforms@eclipsesource.com?subject=JSON%20Forms).
In addition, EclipseSource also offers [professional support](https://jsonforms.io/support) for JSON Forms.

## Migration

See our [migration guide](https://github.com/eclipsesource/jsonforms/blob/master/MIGRATION.md) when updating JSON Forms.

## Developers Documentation

### First time setup

- Install [node.js](https://nodejs.org/) (only Node v18.19+ < 19 is currently supported)
- Install pnpm: <https://pnpm.io/installation> (use pnpm 8.6.2+)
- Clone this repository
- Install dependencies: `pnpm i --frozen-lockfile`

### VS Code dev container

As an alternative to the first time setup, you can use the provided [VS Code dev container](https://code.visualstudio.com/docs/remote/containers) configured in [devcontainer.json](.devcontainer/devcontainer.json).

- Execute command: `Remote Containers: Reopen in container`
- Wait until the container is built and loaded
- First time setup and an initial build of all packages has been executed in the container

**Note:** If you have installed dependencies before opening the remote container, its initialization might fail.
In this case, you can try to clean the repository with `git clean -dfx`. Beware that this removes all untracked files!

### Build & Testing

- Build (all packages): `pnpm run build`
- Test (all packages): `pnpm run test`
- Clean (delete `dist` folder of all packages): `pnpm run clean`
- Run React Vanilla examples: `cd packages/vanilla-renderers && pnpm run dev`
- Run React Material examples: `cd packages/material-renderers && pnpm run dev`
- Run Angular Material examples: `cd packages/angular-material && pnpm run dev`
- Run Vue Vanilla dev setup: `cd packages/vue-vanilla && pnpm run serve`

### Dependency & Release management

For more info about how we handle dependencies and releases in the JSON Forms project, please see our [Developer Documentation wiki page](https://github.com/eclipsesource/jsonforms/wiki/Developer-documentation).

### Continuous Integration

The JSON Forms project is built and tested via Github actions on Linux, Mac and Windows. Coverage is documented by [Coveralls](https://coveralls.io).

Current status: ![Build status](https://github.com/eclipsesource/jsonforms/actions/workflows/ci.yaml/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/eclipsesource/jsonforms/badge.svg?branch=master&service=github)](https://coveralls.io/github/eclipsesource/jsonforms?branch=master)

### Contributions

We welcome community participation! Whether you're reporting bugs, proposing features, participating in discussions, or making direct contributions, your involvement is highly valued.
See [here](https://github.com/eclipsesource/jsonforms/blob/master/CONTRIBUTING.md) for the contribution guidelines.

## License

The JSON Forms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.
