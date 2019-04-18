import React from 'react';
import {generateSchema} from '@jsonforms/examples';
import {JsonForms} from '@jsonforms/react';
import {generateDefaultUISchema, generateJsonSchema} from '@jsonforms/core';
import {Provider} from 'react-redux';
import Typography from "@material-ui/core/Typography";
import {Demo} from "../common";
import {createJsonFormsStore} from "../../common/store";

const InferBothSchemas = () => {

  const schema = generateJsonSchema(generateSchema.data);
  // TODO: this example shouldn't generate its UI schema
  const uischema = generateDefaultUISchema(schema);

  const store = createJsonFormsStore({
    data: generateSchema.data,
    schema,
    uischema
  });

  return (
    <Provider store={store}>
      <Demo schema={schema} uischema={uischema} js={() => <JsonForms />} />
    </Provider>
  );
};

export default InferBothSchemas;