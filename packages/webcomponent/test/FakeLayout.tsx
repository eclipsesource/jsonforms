import * as React from 'react';
import {
  DispatchRenderer,
  Layout,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  registerStartupRenderer,
  RendererProps
} from '@jsonforms/core';
import { connect } from 'react-redux';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const fakeTester: RankedTester = rankWith(1, () => true);

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
    fakeTester,
    connect(mapStateToLayoutProps, null)(FakeLayout)
);
