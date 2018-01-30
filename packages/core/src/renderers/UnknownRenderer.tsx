import * as React from 'react';
import { Component } from 'react';

/**
 * Props of an {@link UnknownRenderer}
 */
export interface UnknownRendererProps {
  /**
   * The type for which no renderer has been found.
   */
  type: 'renderer' | 'field';
}

/**
 * A renderer that will be used in case no other renderer is applicable.
 */
export class UnknownRenderer extends Component<UnknownRendererProps, any> {
  render() {
    return (
      <div style={{color: 'red'}}>
        No applicable {this.props.type} found.
      </div>
    );
  }
}
