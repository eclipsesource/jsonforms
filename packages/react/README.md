# JSON Forms - More Forms. Less Code

_Complex forms in the blink of an eye_

JSON Forms eliminates the tedious task of writing fully-featured forms by hand by leveraging the capabilities of JSON, JSON Schema and Javascript.

## React Package

This is the JSON Forms React package which provides the necessary bindings for React. It uses [JSON Forms Core](https://github.com/eclipsesource/jsonforms/blob/master/packages/core).

You can combine the react package with any react-based renderer set you want, for example the [Material Renderers](https://github.com/eclipsesource/jsonforms/tree/master/packages/material-renderers) or the [Vanilla Renderers](https://github.com/eclipsesource/jsonforms/tree/master/packages/vanilla-renderers).

See the official [documentation](https://jsonforms.io/) and the JSON Forms React [seed repository](https://github.com/eclipsesource/jsonforms-react-seed) for examples on how to integrate JSON Forms with your application.

Check <https://www.npmjs.com/search?q=%40jsonforms> for all published JSON Forms packages.

### Usage

Use the `JsonForms` component to render a form for your data.

Mandatory props:

- `data: any` - the data to show
- `renderers: JsonFormsRendererRegistryEntry[]` - the React renderer set to use

Optional props:

- `schema: JsonSchema` - the data schema for the given data. Will be generated when not given.
- `uischema: UISchemaElement` - the UI schema for the given data schema. Will be generated when not given.
- `cells: JsonFormsCellRendererRegistryEntry[]` - the React cell renderer set to use
- `config: any` - form-wide options. May contain default ui schema options.
- `readonly: boolean` - whether all controls shall be readonly.
- `uischemas: JsonFormsUiSchemaEntry[]` - registry for dynamic ui schema dispatching
- `validationMode: 'ValidateAndShow' | 'ValidateAndHide' | 'NoValidation'` - the validation mode for the form
- `ajv: AJV` - custom Ajv instance for the form
- `onChange` - callback which is called on each data change, containing the updated data and the validation result.

Example:

```ts
import React, { useState } from 'react';
import {
  materialRenderers,
  materialCells,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    done: {
      type: 'boolean',
    },
    due_date: {
      type: 'string',
      format: 'date',
    },
    recurrence: {
      type: 'string',
      enum: ['Never', 'Daily', 'Weekly', 'Monthly'],
    },
  },
  required: ['name', 'due_date'],
};
const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      label: false,
      scope: '#/properties/done',
    },
    {
      type: 'Control',
      scope: '#/properties/name',
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/due_date',
        },
        {
          type: 'Control',
          scope: '#/properties/recurrence',
        },
      ],
    },
  ],
};
const initialData = {};
function App() {
  const [data, setData] = useState(initialData);
  return (
    <JsonForms
      schema={schema}
      uischema={uischema}
      data={data}
      renderers={materialRenderers}
      cells={materialCells}
      onChange={({ data, _errors }) => setData(data)}
    />
  );
}
export default App;
```

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
