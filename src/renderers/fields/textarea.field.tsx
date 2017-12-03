import { JSX } from '../JSX';
import { mapStateToInputProps, registerStartupInput } from './field.util';
import { and, optionIs, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { connect, Event } from '../../common/binding';
import { Field, FieldProps, FieldState } from './field';

export class TextAreaField extends Field<FieldProps, FieldState> {
  render() {
    const { data, className, id, visible, enabled, uischema } = this.props;

    return <textarea
         value={data || ''}
         onChange={(ev: Event<HTMLTextAreaElement>) =>
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
 * Tester for a multi-line string control.
 * @type {RankedTester}
 */
export const textAreaFieldTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  optionIs('multi', true)
));

export default registerStartupInput(
  textAreaFieldTester,
  connect(mapStateToInputProps)(TextAreaField)
);
