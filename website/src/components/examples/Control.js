import React from 'react';
import { controlOptions } from '@jsonforms/examples';
import { JsonFormsDispatch } from '@jsonforms/react';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import { Provider } from 'react-redux';
import { createJsonFormsStore } from '../../common/store';
import Demo from '../common/Demo';

const controlStore = createJsonFormsStore({
  data: controlOptions.data,
  schema: controlOptions.schema,
  uischema: controlOptions.uischema,
});

const extendedControlStore = createJsonFormsStore({
  data: controlOptions.extendedData,
  schema: controlOptions.extendedSchema,
  uischema: controlOptions.extendedUischema,
});

export const Control = () => (
  <Provider store={controlStore}>
    <JsonFormsReduxContext>
      <Demo
        js={() => <JsonFormsDispatch />}
        schema={controlOptions.schema}
        uischema={controlOptions.uischema}
      />
    </JsonFormsReduxContext>
  </Provider>
);

export const ExtendedControl = () => (
  <Provider store={extendedControlStore}>
    <JsonFormsReduxContext>
      <Demo
        js={() => <JsonFormsDispatch />}
        schema={controlOptions.extendedSchema}
        uischema={controlOptions.extendedUischema}
      />
    </JsonFormsReduxContext>
  </Provider>
);
