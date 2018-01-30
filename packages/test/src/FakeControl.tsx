import * as React from 'react';
import {
  connectToJsonForms,
  ControlElement,
  ControlProps,
  convertToValidClassName,
  isControl,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  registerStartupRenderer
} from '@jsonforms/core';

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

const ConnectedFakeControl = connectToJsonForms(mapStateToControlProps, null)(FakeControl);

registerStartupRenderer(fakeControlTester, ConnectedFakeControl);

export default ConnectedFakeControl;
