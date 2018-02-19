import { JsonSchema, UISchemaElement } from '@jsonforms/core';

export interface ExampleDescription {
  name: string;
  label: string;
  data: any;
  schema: JsonSchema;
  uiSchema: UISchemaElement;
  translations?: any;
  locale?: String;
  config?: any;
  setupCallback?(div: HTMLDivElement): void;
}
