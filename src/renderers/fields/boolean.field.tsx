import { JSX } from '../JSX';
import { mapStateToInputProps, registerStartupInput } from './field.util';
import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../core/testers';
import { connect, Event } from '../../common/binding';
import { Field, FieldProps, FieldState } from './field';

export class BooleanField extends Field<FieldProps, FieldState> {
  render() {
    const { data, className, id, visible, enabled, uischema } = this.props;

    return <input type='checkbox'
           checked={data || ''}
           onChange={(ev: Event<HTMLInputElement>) =>
             this.handleChange(ev.currentTarget.checked)
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
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
export const booleanFieldTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaTypeIs('boolean')
  ));
export default registerStartupInput(
  booleanFieldTester,
  connect(mapStateToInputProps)(BooleanField)
);
