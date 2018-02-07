import * as React from 'react';
import { RendererProps } from '@jsonforms/core';

export class Renderer<P extends RendererProps, S> extends React.Component<P, S> {
  constructor(props: P) {
    super(props);
  }
}
