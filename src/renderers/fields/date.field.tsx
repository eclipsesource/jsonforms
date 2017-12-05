import { JSX } from '../JSX';
import { and, formatIs, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { FieldProps, handleChange, mapStateToInputProps, registerStartupInput } from './field.util';
import { connect, Event } from '../../common/binding';

export const DateField = (props: FieldProps) => {
    const { data, className, id, enabled, uischema } = props;

    return <input type='date'
         value={data || ''}
         onChange={(ev: Event<HTMLInputElement>) => handleChange(props, ev.currentTarget.value)}
         className={className}
         id={id}
         disabled={!enabled}
         autoFocus={uischema.options && uischema.options.focus}
    />;
};
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
