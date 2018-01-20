import { JsonSchema, UISchemaElement } from '@jsonforms/core';

export interface ExampleDescription {
  name: string;
  label: string;
  data: any;
  schema: JsonSchema;
  uiSchema: UISchemaElement;
  config?: any;
  setupCallback?(div: HTMLDivElement): void;
}
