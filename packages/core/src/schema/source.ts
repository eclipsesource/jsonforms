import type { ControlConstraints, DataPath, ValueType } from '../model/nodes';
import type { UISchemaElement } from '../model/uischema';

/**
 * Abstract description of a schema location — everything the builder needs to
 * construct a control node, independent of the schema dialect.
 */
export interface SchemaFacets {
  valueType: ValueType;
  title?: string;
  description?: string;
  readOnly?: boolean;
  defaultValue?: unknown;
  constraints?: Readonly<ControlConstraints>;
}

/**
 * Abstracts the schema format away from the presentation-model builder.
 *
 * The builder never interprets schemas itself; it only consumes facets. This is
 * the seam that allows JSON Schema, other dialects, or fully arbitrary
 * definitions to drive a form.
 */
export interface SchemaSource {
  /** Interprets a UI schema scope into abstract facets, or `undefined` if unknown. */
  describe(scope: string): SchemaFacets | undefined;
  /** Maps a UI schema scope to the JSON Pointer of the value it binds. */
  dataPathFor(scope: string): DataPath;
  /** Whether the value at `scope` is required. */
  isRequired(scope: string): boolean;
  /** Default value for the location at `scope` (used for initialization). */
  createDefault(scope: string): unknown;
  /** Generates a default UI structure when no UI schema is provided. */
  generateUISchema(): UISchemaElement;
}
