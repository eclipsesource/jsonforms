import * as React from 'react';
import {
  connectToJsonForms,
  JsonForms,
  Layout,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  RendererProps,
  Test,
} from '@jsonforms/core';

const {
  or,
  uiTypeIs
} = Test;

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const fakeLayoutTester: RankedTester = rankWith(
  1,
  or(
    uiTypeIs('VerticalLayout'),
    uiTypeIs('HorizontalLayout'),
    uiTypeIs('Group')
  )
);

const FakeLayout = (props: RendererProps) => {
  const {uischema, schema, path} = props;
  const layout = uischema as Layout;

  const children = layout.elements.map((e, idx) => (
    <JsonForms
      uischema={e}
      schema={schema}
      path={path}
      key={`${path}-${idx}`}
    />)
  );

  return (
    <div className='layout'>
      {children}
    </div>
  );
};

const ConnectedFakeLayout = connectToJsonForms(mapStateToLayoutProps, null)(FakeLayout);

export default ConnectedFakeLayout;
