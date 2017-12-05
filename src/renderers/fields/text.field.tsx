import { JSX } from '../JSX';
import { FieldProps, handleChange, mapStateToInputProps, registerStartupInput } from './field.util';
import { isControl, RankedTester, rankWith } from '../../core/testers';
import { connect, Event } from '../../common/binding';

export const TextField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return <input type='text'
       value={data || ''}
       onChange={(ev: Event<HTMLInputElement>) => handleChange(props, ev.currentTarget.value)}
       className={className}
       id={id}
       disabled={!enabled}
       autoFocus={uischema.options && uischema.options.focus}
     />;
};

/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textFieldTester: RankedTester = rankWith(1, isControl);

export default registerStartupInput(
  textFieldTester,
  connect(mapStateToInputProps)(TextField)
);
