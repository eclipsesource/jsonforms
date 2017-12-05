import { JSX } from '../../JSX';
import { withIncreasedRank } from '../../../core/testers';
import { mapStateToInputProps, registerStartupInput } from '../../fields/field.util';
import { isControl, RankedTester, rankWith } from '../../../core/testers';
import { connect, Event } from '../../../common/binding';
import { Field, FieldProps, FieldState } from '../../fields/field';
import { dateFieldTester } from '../../fields/date.field';
import Input from 'material-ui/Input';

export class MaterialDateField extends Field<FieldProps, FieldState> {
  render() {
    const { data, className, id, enabled, uischema } = this.props;

    return <Input type='date'
         value={data || ''}
         onChange={ ev =>
           this.handleChange(ev.target.value)
         }
         className={className}
         id={id}
         disabled={!enabled}
         autoFocus={uischema.options && uischema.options.focus}
       />;
   }
}

export default registerStartupInput(
  withIncreasedRank(1, dateFieldTester),
  connect(mapStateToInputProps)(MaterialDateField)
);
