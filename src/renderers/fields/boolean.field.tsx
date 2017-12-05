import { JSX } from '../JSX';
import { FieldProps, handleChange, mapStateToInputProps, registerStartupInput } from './field.util';
import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../core/testers';
import { connect, Event } from '../../common/binding';

export const BooleanField = (props: FieldProps) => {
  const { dispatch, path, data, className, id, enabled, uischema } = props;

  return <input type='checkbox'
         checked={data || ''}
         onChange={(ev: Event<HTMLInputElement>) => handleChange(props, ev.currentTarget.checked)}
         className={className}
         id={id}
         disabled={!enabled}
         autoFocus={uischema.options && uischema.options.focus}
  />;
};

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
