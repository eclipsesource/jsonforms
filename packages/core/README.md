# JSON Forms - More Forms. Less Code

*Complex forms in the blink of an eye*

JSON Forms eliminates the tedious task of writing fully-featured forms by hand by leveraging the capabilities of JSON, JSON Schema and Javascript.

## Core Package

This is the JSON Forms core package. It provides the basic functionality needed to render forms.

In order to use JSON Forms Core you need to decide which UI framework you would like to use.

JSON Forms currently supports [React](https://github.com/eclipsesource/jsonforms/blob/master/packages/react), [Angular](https://github.com/eclipsesource/jsonforms/blob/master/packages/angular) and [Vue](https://github.com/eclipsesource/jsonforms/blob/master/packages/vue).

The following seeds are available:
- [React Seed](https://github.com/eclipsesource/jsonforms-react-seed)
- [Angular Seed](https://github.com/eclipsesource/jsonforms-angular-seed)
- [Vue Seed](https://github.com/eclipsesource/jsonforms-vue-seed)

See the official [documentation](https://jsonforms.io/) and the [Example Package](https://github.com/eclipsesource/jsonforms/blob/master/packages/examples) on how to integrate JSON Forms with your application.

Check <https://www.npmjs.com/search?q=%40jsonforms> for all published JSON Forms packages.

## Upgrading to JSON Forms 3.0

With version 3.0 of JSON Forms we removed `json-schema-ref-parser` from the core package.
This change only affects users of the React variant (Vue and Angular are not affected) and even for React only a few users will need to adjust their code.
To avoid issues and for more information, please have a look at our [migration guide](https://github.com/eclipsesource/jsonforms/blob/master/MIGRATION.md).

## License

The JSON Forms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.

## Roadmap

Our current roadmap is available [here](https://github.com/eclipsesource/jsonforms/blob/master/ROADMAP.md).

## Feedback, Help and Support

JSON Forms is developed by [EclipseSource](https://eclipsesource.com).

If you encounter any problems feel free to [open an issue](https://github.com/eclipsesource/jsonforms/issues/new/choose) on the repo.
For questions and discussions please use the [JSON Forms board](https://jsonforms.discourse.group).
You can also reach us via [email](mailto:jsonforms@eclipsesource.com?subject=JSON%20Forms).
In addition, EclipseSource also offers [professional support](https://jsonforms.io/support) for JSON Forms.


## Migration

See our [migration guide](https://github.com/eclipsesource/jsonforms/blob/master/MIGRATION.md) when updating JSON Forms.