import { JSX } from '../JSX';
import * as _ from 'lodash';
import { mapStateToInputProps, registerStartupInput } from './field.util';
import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../core/testers';
import { connect, Event } from '../../common/binding';
import { Field, FieldProps, FieldState } from './field';

export class NumberField extends Field<FieldProps, FieldState> {
  render() {
    const { data, className, id, visible, enabled, uischema } = this.props;

    return <input type='number'
         step='0.1'
         value={data || ''}
         onChange={(ev: Event<HTMLInputElement>) =>
           this.handleChange(_.toNumber(ev.currentTarget.value))
         }
         className={className}
         id={id}
         hidden={!visible}
         disabled={!enabled}
         autoFocus={uischema.options && uischema.options.focus}
    />;
  }
}

/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
export const numberFieldTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  schemaTypeIs('number')
));

export default registerStartupInput(
  numberFieldTester,
  connect(mapStateToInputProps)(NumberField)
);
