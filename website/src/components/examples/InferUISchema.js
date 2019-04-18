import React from 'react';
import {generateUISchema} from '@jsonforms/examples';
import {JsonForms} from '@jsonforms/react';
import {generateDefaultUISchema, generateJsonSchema} from '@jsonforms/core';
import {Provider} from 'react-redux';
import {Demo} from "../common";
import {createJsonFormsStore} from "../../common/store";

const InferUISchema = () => {

  const schema = generateJsonSchema(generateUISchema.data);
  const uischema = generateDefaultUISchema(schema);

  const store = createJsonFormsStore({
    data: generateUISchema.data,
    schema,
    uischema,
  });

  return (
    <Provider store={store}>
      <Demo schema={schema} uischema={uischema} js={() => <JsonForms />} />
    </Provider>
  );
};

export default InferUISchema;