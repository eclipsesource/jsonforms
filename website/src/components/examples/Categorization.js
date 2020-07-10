import React from 'react';
import { categorization } from '@jsonforms/examples';
import { JsonFormsDispatch, JsonFormsReduxContext } from '@jsonforms/react';
import { Provider } from 'react-redux';
import Demo from '../common/Demo';
import { createJsonFormsStore } from '../../common/store';

const CategorizationExample = () => {
  const store = createJsonFormsStore({
    data: categorization.data,
    schema: categorization.schema,
    uischema: categorization.uischema
  });

  return (
    <Provider store={store}>
      <JsonFormsReduxContext>
        <Demo
          schema={categorization.schema}
          uischema={categorization.uischema}
          js={() => <JsonFormsDispatch />}
        />
      </JsonFormsReduxContext>
    </Provider>
  );
};

export default CategorizationExample;
