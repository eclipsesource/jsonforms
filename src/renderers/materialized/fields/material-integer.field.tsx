import { JSX } from '../../JSX';
import * as _ from 'lodash';
import { withIncreasedRank } from '../../../core/testers';
import { mapStateToInputProps, registerStartupInput } from '../../fields/field.util';
import { isControl, RankedTester, rankWith } from '../../../core/testers';
import { connect, Event } from '../../../common/binding';
import { Field, FieldProps, FieldState } from '../../fields/field';
import { integerFieldTester } from '../../fields/integer.field';
import Input from 'material-ui/Input';

export class MaterialIntegerField extends Field<FieldProps, FieldState> {
  render() {
    const { data, className, id, enabled, uischema } = this.props;

    return <Input type='number'
         value={data || ''}
         onChange={ ev =>
           this.handleChange(_.toInteger(ev.target.value))
         }
         className={className}
         id={id}
         disabled={!enabled}
         autoFocus={uischema.options && uischema.options.focus}
         />;
  }
}
export default registerStartupInput(
    withIncreasedRank(1, integerFieldTester),
    connect(mapStateToInputProps)(MaterialIntegerField)
);
