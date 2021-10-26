import { UISchemaElement, JsonSchema } from '@jsonforms/core';

export type Example = {
  id: string;
  title: string;
  input: {
    schema?: JsonSchema;
    uischema?: UISchemaElement;
    data: Record<string, any>;
  };
};

export type ResolvedSchema = {
  schema?: JsonSchema;
  resolved: boolean;
  error?: string;
};
