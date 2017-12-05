import { JSX } from '../JSX';
import * as _ from 'lodash';
import { UnknownRenderer } from '../unknown.renderer';
import { RankedTester } from '../../core/testers';
import { connect } from '../../common/binding';
import { FieldProps } from './field.util';

export interface DispatchFieldProps extends FieldProps {
  fields?: { tester: RankedTester, field: any }[];
}

export const DispatchField = (dispatchFieldProps: DispatchFieldProps) => {
  const uischema = dispatchFieldProps.uischema;
  const schema = dispatchFieldProps.schema;
  const field = _.maxBy(dispatchFieldProps.fields, r => r.tester(uischema, schema));

  if (field === undefined || field.tester(uischema, schema) === -1) {
    return <UnknownRenderer/>;
  } else {
    const Field = field.field;

    return (
      <Field schema={schema} uischema={uischema} path={dispatchFieldProps.path}/>
    );
  }
};

const mapStateToProps = state => ({
  fields: state.fields || []
});
export default connect(mapStateToProps)(DispatchField);
