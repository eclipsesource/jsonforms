import { StatePropsOfRenderer } from './Renderer';

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
   * An unique ID that can be used to identify the rendered element.
   */
  id: string;
}
