import * as React from 'react';
import {
  DispatchRenderer,
  Layout,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  RendererProps,
  Test,
} from '@jsonforms/core';
import { connect } from 'react-redux';

const {
  or,
  uiTypeIs
} = Test

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
    <DispatchRenderer
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

export default registerStartupRenderer(
    fakeLayoutTester,
    connect(mapStateToLayoutProps, null)(FakeLayout)
);
