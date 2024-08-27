# Contributing to JSON Forms

We enthusiastically welcome participation in the JSON Forms project! Whether you're reporting bugs, proposing features, participating in discussions, or making direct contributions, your involvement is highly valued.

## Ways to Contribute

### Reporting Bugs

If you encounter a bug, please report it via [GitHub issues](https://github.com/eclipsesource/jsonforms/issues/new/choose).
Be sure to include a detailed description of the bug and steps to reproduce it.

### Feature Proposals

To propose a new feature, you can also use [GitHub issues](https://github.com/eclipsesource/jsonforms/issues/new/choose) or discuss it on our [Community Board](https://jsonforms.discourse.group).

### Discussions and Questions

For general discussions and questions about using JSON Forms, please visit our [Community Board](https://jsonforms.discourse.group).

### Code Contributions

If you'd like to contribute code, please do so via a pull request to one of our repositories.
Make sure to review the following sections to understand our requirements and recommendations.

## Before Contributing

### Contributor License Agreement (CLA)

All contributors are required to sign a CLA, which will be checked automatically when you open a pull request.

### Contribution Quality

Contributions to the main repository should adhere to the following:

- Pass all automated checks, including test cases, linting, and format checking.
- Include new unit tests for new code.
- If appropriate, modify an existing example or add a new one to demonstrate the new feature or improvement.

The better the quality of the contribution, the faster it can be merged.

### Contributing Features

If you have an idea for a feature, we recommend first opening an issue or starting a discussion on the [Community Board](https://jsonforms.discourse.group) to assess whether it aligns with the goals and scope of JSON Forms.
We aim to keep the core framework lean and clean, focusing on features that provide the most value.

### Contributing Version Upgrades

We strive to always support the latest versions of dependencies, while carefully managing the lower bounds of our (peer) dependency declarations.
For seed applications, we use the latest dependencies as a testbed to ensure compatibility.

When contributing version upgrades:

- Only raise the lower bound of (peer) dependencies if necessary, or if avoiding such a raise requires substantial effort.
- Extend the upper bounds to include the latest supported version, which should ideally be the latest available stable version
- Test the new JSON Forms version in the respective seed application, both with and without updating the corresponding dependencies. Tip: tools like [yalc](https://github.com/wclr/yalc) can be particularly useful for this purpose.

## Repositories

You can contribute to any of the following repositories:

- [JSON Forms Core](https://github.com/eclipsesource/jsonforms)
- [JSON Forms Website](https://github.com/eclipsesource/jsonforms2-website)
- [JSON Forms React Seed](https://github.com/eclipsesource/jsonforms-react-seed)
- [JSON Forms Vue Seed](https://github.com/eclipsesource/jsonforms-vue-seed)
- [JSON Forms Angular Seed](https://github.com/eclipsesource/jsonforms-angular-seed)

Contributions to our website and documentation are particularly encouraged!
