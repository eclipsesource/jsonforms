export interface UISchemaElement {
  type: string;
}
export interface Layout extends UISchemaElement {
  elements: Array<UISchemaElement>;
}
export interface VerticalLayout extends Layout {
}
export interface ControlElement extends UISchemaElement {
  label: string;
  scope: {
    $ref: string;
  };
}
