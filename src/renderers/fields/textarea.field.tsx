import { JSX } from '../JSX';
import { FieldProps, handleChange, mapStateToInputProps, registerStartupInput } from './field.util';
import { and, optionIs, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { connect, Event } from '../../common/binding';

export const TextAreaField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return <textarea
       value={data || ''}
       onChange={(ev: Event<HTMLTextAreaElement>) => handleChange(props, ev.currentTarget.value)}
       className={className}
       id={id}
       disabled={!enabled}
       autoFocus={uischema.options && uischema.options.focus}
     />;
};

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
