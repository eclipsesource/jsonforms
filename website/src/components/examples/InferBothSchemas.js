import React from 'react';
import { generateSchema } from '@jsonforms/examples';
import { JsonFormsDispatch } from '@jsonforms/react';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import { generateJsonSchema } from '@jsonforms/core';
import { Provider } from 'react-redux';

import { Demo } from '../common';
import { createJsonFormsStore } from '../../common/store';

const InferBothSchemas = () => {
  const schema = generateJsonSchema(generateSchema.data);

  const store = createJsonFormsStore({
    data: generateSchema.data,
    schema,
  });

  return (
    <Provider store={store}>
      <JsonFormsReduxContext>
        <Demo schema={schema} js={() => <JsonFormsDispatch />} />
      </JsonFormsReduxContext>
    </Provider>
  );
};

export default InferBothSchemas;
