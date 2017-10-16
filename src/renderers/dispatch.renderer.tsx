import * as _ from 'lodash';
import { UnknownRenderer } from './unknown.renderer';
import { UISchemaElement } from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';
import { RankedTester } from '../core/testers';
import { connect } from 'inferno-redux';

export interface DispatchRendererProps {

  /**
   * The UI schema to be rendered.
   */
  uischema: UISchemaElement;

  /**
   * The JSON schema that describes the data.
   */
  schema: JsonSchema;

  renderers: { tester: RankedTester, renderer: any }[];

  /**
   * Optional instance path. Necessary when the actual data
   * path can not be inferred via the UI schema element as
   * it is the case with nested controls.
   */
  path?: string;
}

export const DispatchRenderer = (props: DispatchRendererProps) => {
  const { uischema, path, schema, renderers } = props;
  const renderer = _.maxBy(renderers, r => r.tester(uischema, schema));

  if (renderer.tester(uischema, schema) === -1) {
    return <UnknownRenderer/>;
  } else {
    return (
      <renderer.renderer
        uischema={uischema}
        schema={schema}
        path={path}
        renderers={renderers}
      />
    );
  }
};

const mapStateToProps = state => ({
  renderers: state.renderers
});

export default connect(
  mapStateToProps,
  null
)(DispatchRenderer);
