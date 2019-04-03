/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import React from 'react';
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
