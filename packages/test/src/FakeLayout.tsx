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
import React from 'react';
import {
  Layout,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  RendererProps,
  Test,
} from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import { connect } from 'react-redux';

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

const ConnectedFakeLayout = connect(mapStateToLayoutProps, null)(FakeLayout);

export default ConnectedFakeLayout;
