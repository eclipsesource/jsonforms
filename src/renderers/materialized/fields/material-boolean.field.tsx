import { JSX } from '../../JSX';
import { withIncreasedRank } from '../../../core/testers';
import { mapStateToInputProps, registerStartupInput } from '../../fields/field.util';
import { isControl, RankedTester, rankWith } from '../../../core/testers';
import { connect, Event } from '../../../common/binding';
import { Field, FieldProps, FieldState } from '../../fields/field';
import { booleanFieldTester } from '../../fields/boolean.field';
import Checkbox from 'material-ui/Checkbox';

export class MaterialBooleanField extends Field<FieldProps, FieldState> {
  render() {
    const { data, className, id, enabled, uischema } = this.props;

    return <Checkbox
         checked={data || ''}
         onChange={ (ev, checked) =>
           this.handleChange(checked)
         }
         className={className}
         id={id}
         disabled={!enabled}
         autoFocus={uischema.options && uischema.options.focus}
       />;
   }
}

export default registerStartupInput(
  withIncreasedRank(1, booleanFieldTester),
  connect(mapStateToInputProps)(MaterialBooleanField)
);
