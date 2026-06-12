export interface UISchemaElementBase {
  /** Renderer hints, surfaced on the node as `uiOptions`. */
  options?: Readonly<Record<string, unknown>>;
}

/** Binds a single value of the data to a control. */
export interface ControlElement extends UISchemaElementBase {
  type: 'Control';
  /**
   * Schema scope this control binds to, interpreted by the active `SchemaSource`
   * (for JSON Schema e.g. `#/properties/name`).
   */
  scope: string;
  /** Optional label override; defaults to the schema title. */
  label?: string;
}

/** Groups child elements without binding data itself. */
export interface LayoutElement extends UISchemaElementBase {
  type: 'VerticalLayout' | 'HorizontalLayout';
  label?: string;
  elements: readonly UISchemaElement[];
}

export type UISchemaElement = ControlElement | LayoutElement;
