import type { JsonSchema, UISchemaElement } from '@jsonforms/core';
import type { ZodType } from 'zod';

export interface ExampleBase {
  id: string;
  title: string;
  description?: string;
  /** Omitted to demonstrate UI schema generation. */
  uischema?: UISchemaElement;
  data: unknown;
}

/** An example form defined by a JSON Schema — pure, serializable data. */
export interface JsonSchemaExample extends ExampleBase {
  format: 'json-schema';
  schema: JsonSchema;
}

/**
 * An example form defined by a zod schema. Zod schemas are code, not data —
 * `schemaText` carries a displayable source snippet for the demo apps.
 */
export interface ZodExample extends ExampleBase {
  format: 'zod';
  schema: ZodType;
  schemaText: string;
}

export type Example = JsonSchemaExample | ZodExample;

/** A group of examples sharing a schema format. */
export interface ExampleGroup {
  id: string;
  title: string;
  examples: readonly Example[];
}
