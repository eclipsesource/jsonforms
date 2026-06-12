import type { JsonSchema, UISchemaElement } from '@jsonforms/core';

/** An example form defined by a JSON Schema. Examples are pure data. */
export interface JsonSchemaExample {
  id: string;
  title: string;
  description?: string;
  schema: JsonSchema;
  /** Omitted to demonstrate UI schema generation. */
  uischema?: UISchemaElement;
  data: unknown;
}

/**
 * A group of examples sharing a schema format. Currently only JSON Schema;
 * other schema formats (zod, plain definitions, …) become sibling groups once
 * their `SchemaSource` implementations exist.
 */
export interface ExampleGroup {
  id: string;
  title: string;
  examples: readonly JsonSchemaExample[];
}
