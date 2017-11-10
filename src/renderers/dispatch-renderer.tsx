import { JSX } from './JSX';
import * as _ from 'lodash';
import { UnknownRenderer } from './unknown.renderer';
import { RankedTester } from '../core/testers';
import { connect } from '../common/binding';
import { RendererProps } from '../core/renderer';

export interface DispatchRendererProps extends RendererProps {
  renderers?: { tester: RankedTester, renderer: any }[];
}

export const DispatchRenderer = ({ uischema, schema, path, renderers }: DispatchRendererProps) => {
  const renderer = _.maxBy(renderers, r => r.tester(uischema, schema));

  if (renderer === undefined || renderer.tester(uischema, schema) === -1) {
    return <UnknownRenderer/>;
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

const mapStateToProps = state => ({
  renderers: state.renderers || []
});

export default connect(
  mapStateToProps,
  null
)(DispatchRenderer);
