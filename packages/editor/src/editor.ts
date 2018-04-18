import { JsonSchema } from '@jsonforms/core';

/**
 * Interface defining a minimal interface for a JsonSchema-based editor.
 */
export interface Editor {
  /**
   * The data object edited in the editor.
   */
  data: Object;
  /**
   * The {@link JsonSchema} describing the data edited in the editor.
   */
  readonly schema: JsonSchema;
}
