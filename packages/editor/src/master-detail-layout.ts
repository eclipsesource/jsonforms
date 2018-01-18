import {
    LabelDescription,
    Scopable,
    UISchemaElement
} from '@jsonforms/core';

export interface MasterDetailLayout extends UISchemaElement, Scopable {
  type: 'MasterDetailLayout';
  /**
   * An optional label that will be associated with the control
   */
  label?: string | boolean | LabelDescription;

  options?: any;
}
