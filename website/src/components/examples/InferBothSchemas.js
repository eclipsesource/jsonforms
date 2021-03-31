import React from 'react';
import { generateSchema } from '@jsonforms/examples';
import { generateJsonSchema } from '@jsonforms/core';
import { Demo } from '../common';

const InferBothSchemas = () => {
  const schema = generateJsonSchema(generateSchema.data);

  return <Demo schema={schema} data={generateSchema.data} />;
};

export default InferBothSchemas;
