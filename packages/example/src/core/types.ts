import {
  UISchemaElement,
  JsonSchema,
  JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';

export type Example = {
  id: string;
  title: string;
  input: {
    schema?: JsonSchema;
    uischema?: UISchemaElement;
    data: Record<string, any>;
    i18n?: Record<string, any>;
    renderers?: JsonFormsRendererRegistryEntry[];
  };
};

export type ResolvedSchema = {
  schema?: JsonSchema;
  resolved: boolean;
  error?: string;
};
