import * as React from 'react';
import {
  ControlElement,
  ControlProps,
  convertToValidClassName,
  isControl,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  registerStartupRenderer
} from '@jsonforms/core';
import { connect } from 'react-redux';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const fakeControlTester: RankedTester = rankWith(2, isControl);

const FakeControl = (props: ControlProps) => {

  const {uischema} = props;
  const controlElement = uischema as ControlElement;

  return (
    <div className={convertToValidClassName(controlElement.scope)}/>
  );
};

export default registerStartupRenderer(
    fakeControlTester,
    connect(mapStateToControlProps, null)(FakeControl)
);
