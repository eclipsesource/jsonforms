import React from 'react';
import { layout } from '@jsonforms/examples';
import { JsonForms } from '@jsonforms/react';
import { Provider } from 'react-redux';
import { Demo } from "../common";
import {createJsonFormsStore} from "../../common/store";


const verticalLayoutStore = createJsonFormsStore({
  data: layout.data,
  schema: layout.schema,
  uischema: layout.uischemaVertical
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
    <Demo
      js={() => <JsonForms />}
      uischema={layout.uischemaHorizontal}
      schema={layout.schema}
    />
  </Provider>
);

export const VerticalLayout = () => (
  <Provider store={verticalLayoutStore}>
    <Demo
      js={() => <JsonForms/> }
      uischema={layout.uischemaVertical}
      schema={layout.schema}
    />
  </Provider>
)

export const Group = () => (
         <Provider store={groupStore}>
           <Demo
             js={() => <JsonForms />}
             uischema={layout.uischemaGroup}
             schema={layout.schema}
           />
         </Provider>
       );

export const NestedLayouts = () => (
      <Provider store={complexStore}>
        <Demo
          js={() => <JsonForms/> }
          uischema={layout.uischemaComplex}
          schema={layout.schema}
        />
      </Provider>
)