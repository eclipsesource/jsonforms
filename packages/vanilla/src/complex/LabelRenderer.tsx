import * as React from 'react';
import * as _ from 'lodash';
import {
  connectToJsonForms,
  isVisible,
  LabelElement,
  RankedTester,
  rankWith,
  RendererProps,
  StatelessRenderer,
  uiTypeIs,
} from '@jsonforms/core';
import { getStyle as findStyle, getStyleAsClassName as findStyleAsClassName } from '../reducers';
import { VanillaRendererProps } from '../index';

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

const mapStateToProps = (state, ownProps) => {
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);

  return {
    visible,
    getStyle: findStyle(state),
    getStyleAsClassName: findStyleAsClassName(state),
  };
};

export default connectToJsonForms(mapStateToProps, null)(LabelRenderer);
