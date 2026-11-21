import React from 'react';
import { generateUISchema } from '@jsonforms/examples';
import { generateDefaultUISchema, generateJsonSchema } from '@jsonforms/core';
import { Demo } from '../common/Demo';

const InferUISchema = () => {
  const schema = generateJsonSchema(generateUISchema.data);
  const uischema = generateDefaultUISchema(schema);

  return (
    <Demo schema={schema} uischema={uischema} data={generateUISchema.data} />
  );
};

export default InferUISchema;
