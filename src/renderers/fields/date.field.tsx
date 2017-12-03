import { JSX } from '../JSX';
import * as _ from 'lodash';
import { and, formatIs, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { mapStateToInputProps, registerStartupInput } from './field.util';
import { connect, Event } from '../../common/binding';
import { Field, FieldProps, FieldState } from './field';

export class DateField extends Field<FieldProps, FieldState> {
  render() {
    const { data, className, id, visible, enabled, uischema } = this.props;

    return <input type='date'
         value={data || ''}
         onChange={(ev: Event<HTMLInputElement>) => {
           this.handleChange(ev.currentTarget.value);
         }}
         className={className}
         id={id}
         hidden={!visible}
         disabled={!enabled}
         autoFocus={uischema.options && uischema.options.focus}
    />;
  }
}
/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export const dateFieldTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  formatIs('date')
));

export default registerStartupInput(
  dateFieldTester,
  connect(mapStateToInputProps)(DateField)
);
