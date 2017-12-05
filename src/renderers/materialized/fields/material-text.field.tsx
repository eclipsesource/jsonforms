import { JSX } from '../../JSX';
import { withIncreasedRank } from '../../../core/testers';
import { mapStateToInputProps, registerStartupInput } from '../../fields/field.util';
import { isControl, RankedTester, rankWith } from '../../../core/testers';
import { connect, Event } from '../../../common/binding';
import { Field, FieldProps, FieldState } from '../../fields/field';
import { textFieldTester } from '../../fields/text.field';
import Input from 'material-ui/Input';

export class MaterialTextField extends Field<FieldProps, FieldState> {
  render() {
    const { data, className, id, enabled, uischema } = this.props;

    return <Input type='text'
         value={data || ''}
         onChange={ ev =>
           this.handleChange(ev.target.value)
         }
         className={className}
         id={id}
         disabled={!enabled}
         autoFocus={uischema.options && uischema.options.focus}
         multiline={uischema.options && uischema.options.multi}
       />;
   }
}

export default registerStartupInput(
  withIncreasedRank(1, textFieldTester),
  connect(mapStateToInputProps)(MaterialTextField)
);
