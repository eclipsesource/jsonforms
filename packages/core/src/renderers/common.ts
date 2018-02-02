import { StatePropsOfRenderer } from './Renderer';
import { JsonSchema } from '../models/jsonSchema';

/**
 * State-based properties for UI schema elements that have a scope.
 */
export interface StatePropsOfScopedRenderer extends StatePropsOfRenderer {

  /**
   * The data to be rendered.
   */
  data: any;

  /**
   * The absolute dot-separated path to the value being rendered.
   * A path is a sequence of property names separated by dots,
   * e.g. for accessing the value of b in the object
   * { foo: { a: { b: 42 } } }, one would use foo.a.b.
   */
  path: string;

  /**
   * Path of the parent renderer, if any.
   */
  parentPath?: string;

  /**
   * The sub-schema that describes the data this element is bound to.
   */
  scopedSchema: JsonSchema;

  /**
   * An unique ID that can be used to identify the rendered element.
   */
  id: string;
}
