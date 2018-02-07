import * as React from 'react';
import { RendererProps } from '@jsonforms/core';

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
