import * as React from 'react';
import * as _ from 'lodash';
import {
  isVisible,
  LabelElement,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  uiTypeIs,
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { VanillaRendererProps } from '../helpers';
import { getStyle as findStyle, getStyleAsClassName as findStyleAsClassName } from '../reducers';

/**
 * Default tester for a label.
 * @type {RankedTester}
 */
export const labelRendererTester: RankedTester = rankWith(1, uiTypeIs('Label'));

/**
 * Default renderer for a label.
 */
export const LabelRenderer = ({ uischema, visible, getStyleAsClassName }: VanillaRendererProps) => {
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

export default registerStartupRenderer(
  labelRendererTester,
  connect(mapStateToProps, null)(LabelRenderer)
);
