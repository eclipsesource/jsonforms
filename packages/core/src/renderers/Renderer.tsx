import * as React from 'react';
import { JsonSchema } from '../models/jsonSchema';
import { UISchemaElement } from '../models/uischema';

/**
 * State-based props of a {@link Renderer}.
 */
export interface StatePropsOfRenderer {
  /**
   * The UI schema to be rendered.
   */
  uischema: UISchemaElement;

  /**
   * The JSON schema that describes the data.
   */
  schema: JsonSchema;

  /**
   * Whether the rendered element should be visible.
   */
  visible?: boolean;

  /**
   * Whether the rendered element should be enabled.
   */
  enabled?: boolean;

  /**
   * Optional instance path. Necessary when the actual data
   * path can not be inferred via the UI schema element as
   * it is the case with nested controls.
   */
  path?: string;

  /**
   * Any configuration options for the element.
   */
  config?: any;
}

/**
 * Props of a {@link Renderer}.
 */
export interface RendererProps extends StatePropsOfRenderer { }

/**
 * Convenience wrapper around React's Component for constraining props.
 *
 * @template P type of any renderer props
 * @template S state of the Renderer
 */
export class RendererComponent<P extends RendererProps, S = {}> extends React.Component<P, S> {
  constructor(props: P) {
    super(props);
  }
}

/**
 * Stateless Renderer.
 *
 * @template P type of any renderer props
 */
export interface StatelessRenderer<P extends RendererProps> extends React.StatelessComponent<P> {

}

/**
 * Represents a Renderer, which might either be a component or a function.
 */
export type Renderer =
  RendererComponent<RendererProps & any, {}> | StatelessRenderer<RendererProps & any>;
