import { JSX } from '../JSX';
import * as _ from 'lodash';
import { UnknownRenderer } from '../unknown.renderer';
import { RankedTester } from '../../core/testers';
import { connect } from '../../common/binding';
import { FieldProps } from './field';

export interface DispatchFieldProps extends FieldProps {
  inputs?: { tester: RankedTester, input: any }[];
}

export const DispatchField = (dispatchInputProps: DispatchFieldProps) => {
  const uischema = dispatchInputProps.uischema;
  const schema = dispatchInputProps.schema;
  const renderer = _.maxBy(dispatchInputProps.inputs, r => r.tester(uischema, schema));

  if (renderer === undefined || renderer.tester(uischema, schema) === -1) {
    return <UnknownRenderer/>;
  } else {
    const Render = renderer.input;

    return (
      <Render schema={schema} uischema={uischema} path={dispatchInputProps.path}/>
    );
  }
};

const mapStateToProps = state => ({
  inputs: state.inputs || []
});
export default connect(mapStateToProps)(DispatchField);
