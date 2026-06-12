import type { FormConfig, FormEngine, SchemaSource } from '@jsonforms/core';
import { createFormEngine, jsonSchemaSource } from '@jsonforms/core';
import type { Example } from '@jsonforms/examples';
import { findExample } from '@jsonforms/examples';
import { zodSchemaSource } from '@jsonforms/zod';
import type { ValidationSettings } from './validators';
import { createValidator } from './validators';

/** Resolves the {@link SchemaSource} matching an example's schema format. */
export const schemaSourceFor = (example: Example): SchemaSource =>
  example.format === 'zod'
    ? zodSchemaSource(example.schema)
    : jsonSchemaSource(example.schema);

/**
 * Everything needed to set up a demo form engine — plain serializable JSON.
 * Examples are referenced by id: like a real server, the engine host owns
 * the schemas and never receives them over the wire (zod schemas could not
 * be serialized anyway).
 */
export interface DemoEngineInputs {
  exampleId: string;
  validation: ValidationSettings;
  config?: Readonly<FormConfig>;
}

export const createDemoEngine = (inputs: DemoEngineInputs): FormEngine => {
  const example = findExample(inputs.exampleId);
  if (example === undefined) {
    throw new Error(`Unknown example '${inputs.exampleId}'.`);
  }
  return createFormEngine({
    schemaSource: schemaSourceFor(example),
    uischema: example.uischema,
    data: example.data,
    validator: createValidator(inputs.validation, example),
    config: inputs.config,
  });
};
