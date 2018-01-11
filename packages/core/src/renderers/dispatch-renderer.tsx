import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { UnknownRenderer } from './unknown.renderer';
import { RankedTester } from '../testers';
import { RendererProps } from './renderer';
import { getSchema, getUiSchema } from '../reducers';

export interface DispatchRendererProps extends RendererProps {
  renderers?: { tester: RankedTester, renderer: any }[];
}

const Dispatch = ({ uischema, schema, path, renderers }: DispatchRendererProps) => {
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

const mapStateToProps = (state, ownProps) => ({
  renderers: state.renderers || [],
  schema: ownProps.schema || getSchema(state),
  uischema: ownProps.uischema || getUiSchema(state)
});

export const DispatchRenderer = connect(
  mapStateToProps,
  null
)(Dispatch);

export default DispatchRenderer;
