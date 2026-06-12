import type { FormEngine, JsonSchema, UISchemaElement } from '@jsonforms/core';
import { createFormEngine, jsonSchemaSource } from '@jsonforms/core';
import type { ValidationChoice } from './validators';
import { createValidator } from './validators';

/**
 * Everything needed to set up a demo form engine — plain serializable JSON,
 * so the same inputs configure a local engine, a worker-hosted engine, or a
 * server-hosted one.
 */
export interface DemoEngineInputs {
  schema: JsonSchema;
  uischema?: UISchemaElement;
  data: unknown;
  validation: ValidationChoice;
}

export const createDemoEngine = (inputs: DemoEngineInputs): FormEngine =>
  createFormEngine({
    schemaSource: jsonSchemaSource(inputs.schema),
    uischema: inputs.uischema,
    data: inputs.data,
    validator: createValidator(inputs.validation, inputs.schema),
  });
