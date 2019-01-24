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
import has from 'lodash/has';
import React from 'react';
import {
    isVisible, JsonFormsState,
    LabelElement, OwnPropsOfRenderer,
    RankedTester,
    rankWith,
    RendererProps,
    uiTypeIs,
} from '@jsonforms/core';
import { getStyle as findStyle, getStyleAsClassName as findStyleAsClassName } from '../reducers';
import { VanillaRendererProps } from '../index';
import { StatelessRenderer } from '@jsonforms/react';
import { connect } from 'react-redux';

/**
 * Default tester for a label.
 * @type {RankedTester}
 */
export const labelRendererTester: RankedTester = rankWith(1, uiTypeIs('Label'));

/**
 * Default renderer for a label.
 */
export const LabelRenderer: StatelessRenderer<RendererProps & VanillaRendererProps> =
  ({ uischema, visible, getStyleAsClassName }) => {
    const labelElement: LabelElement = uischema as LabelElement;
    const classNames = getStyleAsClassName('label-control');
    const isHidden = !visible;

    return (
      <label
        hidden={isHidden}
        className={classNames}
      >
        {labelElement.text !== undefined && labelElement.text !== null && labelElement.text}
      </label>
    );
  };

const mapStateToProps = (state: JsonFormsState, ownProps: OwnPropsOfRenderer) => {
  const visible = has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);

  return {
    visible,
    getStyle: findStyle(state),
    getStyleAsClassName: findStyleAsClassName(state),
  };
};

export default connect(mapStateToProps, null)(LabelRenderer);
