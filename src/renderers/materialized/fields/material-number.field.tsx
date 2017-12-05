import { JSX } from '../../JSX';
import * as _ from 'lodash';
import { withIncreasedRank } from '../../../core/testers';
import { mapStateToInputProps, registerStartupInput } from '../../fields/field.util';
import { isControl, RankedTester, rankWith } from '../../../core/testers';
import { connect, Event } from '../../../common/binding';
import { Field, FieldProps, FieldState } from '../../fields/field';
import { numberFieldTester } from '../../fields/number.field';
import Input from 'material-ui/Input';

export class MaterialNumberField extends Field<FieldProps, FieldState> {
  render() {
    const { data, className, id, enabled, uischema } = this.props;
    const config = {'step': '0.1'};

    return <Input type='number'
         value={data || ''}
         onChange={ ev =>
           this.handleChange(_.toNumber(ev.target.value))
         }
         className={className}
         id={id}
         disabled={!enabled}
         autoFocus={uischema.options && uischema.options.focus}
         inputProps={config}
         />;
  }
}
export default registerStartupInput(
    withIncreasedRank(1, numberFieldTester),
    connect(mapStateToInputProps)(MaterialNumberField)
);
