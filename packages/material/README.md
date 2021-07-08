# JSON Forms - More Forms. Less Code

*Complex forms in the blink of an eye*

JSON Forms eliminates the tedious task of writing fully-featured forms by hand by leveraging the capabilities of JSON, JSON Schema and Javascript.

## Material Renderers Package

This is the JSON Forms Material Renderers Package. This package only contains renderers and must be combined with [JSON Forms React](https://github.com/eclipsesource/jsonforms/blob/master/packages/react).

See the official [documentation](https://jsonforms.io/docs/integrations/react/) and the JSON Forms React [seed repository](https://github.com/eclipsesource/jsonforms-react-seed) for examples on how to integrate JSON Forms with your application.

You can combine [JSON Forms React](https://github.com/eclipsesource/jsonforms/blob/master/packages/react) with other renderers too, for example with the [Vanilla Renderers](https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla-renderers).

Check <https://www.npmjs.com/search?q=%40jsonforms> for all published JSONForms packages.

### Quick start

Install JSON Forms Core, React and React Material Renderers

```bash
npm i --save @jsonforms/core @jsonforms/react @jsonforms/material-renderers
```

Use the `JsonForms` component for each form you want to render and hand over the renderer set.

```js
import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';

function App() {
  const [data, setData] = useState(initialData);
  return (
    <div className='App'>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data, _errors }) => setData(data)}
      />
    </div>
  );
}
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
