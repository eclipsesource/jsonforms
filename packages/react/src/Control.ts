/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
import { RendererComponent } from './Renderer';
import { ControlProps, ControlState } from '@jsonforms/core';

/**
 * A controlled component convenience wrapper that additionally manages a focused state.
 *
 * @template P control specific properties
 * @template S the state managed by the control
 */
export class Control<P extends ControlProps, S extends ControlState>
  extends RendererComponent<P, S> {

  constructor(props: P) {
    super(props);
    // tslint:disable:no-object-literal-type-assertion
    this.state = {
      value: props.data ? props.data : '',
      isFocused: false
    } as S;
    // tslint:enable:no-object-literal-type-assertion
  }

  /**
   * Propagates a value change.
   *
   * @param value the updated value
   */
  handleChange = value => {
    this.setState({ value });
    this.updateData(value);
  }

  /**
   * Set the focused state to true.
   */
  onFocus = () => {
    this.setState({ isFocused:  true });
  }

  /**
   * Set the focused state to false.
   */
  onBlur = () => {
    this.setState({ isFocused:  false });
  }

  private updateData = value => {
    this.props.handleChange(this.props.path, value);
  }
}
