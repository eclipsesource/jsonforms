import { JSX } from '../JSX';
import { mapStateToInputProps, registerStartupInput } from './field.util';
import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../core/testers';
import { connect, Event } from '../../common/binding';
import { Field, FieldProps, FieldState } from './field';

export class TextField extends Field<FieldProps, FieldState> {
  render() {
    const { data, className, id, visible, enabled, uischema } = this.props;

    return <input type='text'
         value={data || ''}
         onChange={(ev: Event<HTMLInputElement>) =>
           this.handleChange(ev.currentTarget.value)
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
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textFieldTester: RankedTester = rankWith(1, and(
  uiTypeIs('Control'),
  schemaTypeIs('string')
));

export default registerStartupInput(
  textFieldTester,
  connect(mapStateToInputProps)(TextField)
);
