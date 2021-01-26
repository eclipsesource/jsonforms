import React from 'react';
import { layout } from '@jsonforms/examples';
import { JsonFormsDispatch } from '@jsonforms/react';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import { Provider } from 'react-redux';
import { Demo } from '../common';
import { createJsonFormsStore } from '../../common/store';

const verticalLayoutStore = createJsonFormsStore({
  data: layout.data,
  schema: layout.schema,
  uischema: layout.uischemaVertical,
});

const groupStore = createJsonFormsStore({
  data: layout.data,
  schema: layout.schema,
  uischema: layout.uischemaGroup,
});

const horizontalStore = createJsonFormsStore({
  data: layout.data,
  schema: layout.schema,
  uischema: layout.uischemaHorizontal,
});

const complexStore = createJsonFormsStore({
  data: layout.data,
  schema: layout.schema,
  uischema: layout.uischemaComplex,
});

export const HorizontalLayout = () => (
  <Provider store={horizontalStore}>
    <JsonFormsReduxContext>
      <Demo
        js={() => <JsonFormsDispatch />}
        uischema={layout.uischemaHorizontal}
        schema={layout.schema}
      />
    </JsonFormsReduxContext>
  </Provider>
);

export const VerticalLayout = () => (
  <Provider store={verticalLayoutStore}>
    <JsonFormsReduxContext>
      <Demo
        js={() => <JsonFormsDispatch />}
        uischema={layout.uischemaVertical}
        schema={layout.schema}
      />
    </JsonFormsReduxContext>
  </Provider>
);

export const Group = () => (
  <Provider store={groupStore}>
    <JsonFormsReduxContext>
      <Demo
        js={() => <JsonFormsDispatch />}
        uischema={layout.uischemaGroup}
        schema={layout.schema}
      />
    </JsonFormsReduxContext>
  </Provider>
);

export const NestedLayouts = () => (
  <Provider store={complexStore}>
    <JsonFormsReduxContext>
      <Demo
        js={() => <JsonFormsDispatch />}
        uischema={layout.uischemaComplex}
        schema={layout.schema}
      />
    </JsonFormsReduxContext>
  </Provider>
);
