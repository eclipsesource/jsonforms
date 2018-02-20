import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { UnknownRenderer } from './UnknownRenderer';
import { DispatchRendererProps, mapStateToDispatchRendererProps } from '@jsonforms/core';

const JsonFormsDispatchRenderer =
  ({ uischema, schema, path, renderers }: DispatchRendererProps) => {
  const renderer = _.maxBy(renderers, r => r.tester(uischema, schema));
  if (renderer === undefined || renderer.tester(uischema, schema) === -1) {
    return <UnknownRenderer type={'renderer'}/>;
  } else {
    const Render = renderer.renderer;

    return (
      <Render
        uischema={uischema}
        schema={schema}
        path={path}
        renderers={renderers}
      />
    );
  }
};

export const JsonForms = connect(
  mapStateToDispatchRendererProps,
  null
)(JsonFormsDispatchRenderer);
