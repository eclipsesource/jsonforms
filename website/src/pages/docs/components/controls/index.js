import React from 'react';
import { Provider } from 'react-redux';
import { JsonForms } from '@jsonforms/react';
import {createJsonFormsStore} from "../../../../common/store";
import { Demo } from "../../../../components/common"

export const input = {
  schema: {
    properties: {
      name: {  'type': 'string' }
    }
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/name'
  },
  data: {
    name: 'Ottgar',
  }
};

const store = createJsonFormsStore({
  data: input.data,
  schema: input.schema,
  uischema: input.uischema
});

export const Example = () => (
  <Provider store={store} >
    <Demo
      js={() => {
        return (
          <JsonForms
            schema={input.schema}
            uischema={input.uischema}
          />
        )
      }}
      schema={input.schema}
      uischema={input.uischema}
    />
  </Provider>
)