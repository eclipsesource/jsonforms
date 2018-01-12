import * as React from 'react';
import * as _ from 'lodash';
import {
  getStyleAsClassName as styleAsClassName,
  isVisible,
  LabelElement,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  uiTypeIs,
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { VanillaRendererProps } from '../index';

/**
 * Default tester for a label.
 * @type {RankedTester}
 */
export const labelRendererTester: RankedTester = rankWith(1, uiTypeIs('Label'));

/**
 * Default renderer for a label.
 */
export const LabelRenderer = ({ getStyleAsClassName, uischema, visible }: VanillaRendererProps) => {
  const labelElement: LabelElement = uischema as LabelElement;
  const classNames = getStyleAsClassName('label-control');
  const isHidden = !visible;

  return (
    <label hidden={isHidden} className={classNames}>
      {labelElement.text !== undefined && labelElement.text !== null && labelElement.text}
    </label>
  );
};

const mapStateToProps = (state, ownProps) => {
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);

  return {
    visible,
    getStyleAsClassName: styleAsClassName(state)
  };
};

export default registerStartupRenderer(
  labelRendererTester,
  connect(mapStateToProps, null)(LabelRenderer)
);
