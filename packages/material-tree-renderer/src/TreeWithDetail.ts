import { LabelDescription, Scopable, UISchemaElement } from '@jsonforms/core';

export interface TreeWithDetail extends UISchemaElement, Scopable {
  type: 'TreeWithDetail';
  /**
   * An optional label that will be associated with the control
   */
  label?: string | boolean | LabelDescription;
}
