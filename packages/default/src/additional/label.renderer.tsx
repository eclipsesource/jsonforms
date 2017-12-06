import * as React from 'react';
import * as _ from 'lodash';
import {
  JsonForms,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  uiTypeIs,
  RendererProps,
  LabelElement,
  isVisible
} from 'jsonforms-core';
import {connect} from 'react-redux';

/**
 * Default tester for a label.
 * @type {RankedTester}
 */
export const labelRendererTester: RankedTester = rankWith(1, uiTypeIs('Label'));

/**
 * Default renderer for a label.
 */
export const LabelRenderer = ({uischema, visible}: RendererProps) => {
  const labelElement: LabelElement = uischema as LabelElement;
  const classNames = JsonForms.stylingRegistry.getAsClassName('label-control');
  const isHidden = !visible;

  return (
    <label hidden={isHidden} className={classNames}>
      {
        labelElement.text !== undefined && labelElement.text !== null && labelElement.text
      }
    </label>
  );
};

const mapStateToProps = (state, ownProps) => {
  const visible = _.has(ownProps, 'visible') ? ownProps.visible :  isVisible(ownProps, state);

  return {
    visible
  };
};

export default registerStartupRenderer(
  labelRendererTester,
  connect(mapStateToProps, null)(LabelRenderer)
);
